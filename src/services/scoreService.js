import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs, doc, setDoc, increment, getDoc } from 'firebase/firestore';

const SCORES_COLLECTION = 'scores_history'; // Log of all games played
const LEADERBOARD_COLLECTION = 'leaderboard'; // Aggregated scores per player

/**
 * Uloží skóre hráče do databáze a aktualizuje jeho celkové skóre
 * @param {string} playerName - Jméno hráče
 * @param {string} gameId - ID hry (např. 'math-counting')
 * @param {number} score - Dosažené skóre
 * @returns {Promise<boolean>} - True pokud se uložení podařilo
 */
export const saveScore = async (playerName, gameId, score) => {
  try {
    const normalizedName = playerName.trim();
    
    // 1. Save to history (log)
    await addDoc(collection(db, SCORES_COLLECTION), {
      playerName: normalizedName,
      gameId,
      score,
      timestamp: new Date().toISOString()
    });

    // 2. Update aggregated leaderboard
    // We use the player name as the document ID (so "Pepa" is always the same document)
    // Note: In a real app with auth, we would use User ID. Here we rely on unique names.
    const playerRef = doc(db, LEADERBOARD_COLLECTION, normalizedName.toLowerCase());
    
    // Check if player exists to preserve the display name casing (e.g. "Pepa" vs "pepa")
    const playerSnap = await getDoc(playerRef);
    
    // Determine category
    const isMath = gameId.startsWith('math-');
    const isCzech = gameId.startsWith('czech-');

    if (playerSnap.exists()) {
      const updateData = {
        totalScore: increment(score), // Grand total
        lastPlayed: new Date().toISOString(),
        scores: {
          [gameId]: increment(score)
        }
      };

      if (isMath) updateData.totalScoreMath = increment(score);
      if (isCzech) updateData.totalScoreCzech = increment(score);

      await setDoc(playerRef, updateData, { merge: true });
    } else {
      const initialData = {
        playerName: normalizedName,
        totalScore: score,
        lastPlayed: new Date().toISOString(),
        scores: {
          [gameId]: score
        }
      };

      if (isMath) initialData.totalScoreMath = score;
      if (isCzech) initialData.totalScoreCzech = score;

      await setDoc(playerRef, initialData);
    }

    return true;
  } catch (e) {
    console.error("Chyba při ukládání skóre: ", e);
    return false;
  }
};

/**
 * Načte globální žebříček (podle celkového skóre nebo kategorie)
 * @param {string} category - 'all', 'math', 'czech'
 * @param {number} limitCount - Počet záznamů (default 10)
 * @returns {Promise<Array>} - Seznam nejlepších hráčů
 */
export const getGlobalLeaderboard = async (category = 'all', limitCount = 10) => {
  try {
    // Fetch all and sort in JS to avoid index requirements
    const q = query(collection(db, LEADERBOARD_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        let score = 0;
        
        if (category === 'math') score = data.totalScoreMath || 0;
        else if (category === 'czech') score = data.totalScoreCzech || 0;
        else score = data.totalScore || 0;

        return { id: doc.id, ...data, score };
      })
      .filter(player => player.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limitCount);

  } catch (e) {
    console.error("Chyba při načítání žebříčku: ", e);
    return [];
  }
};

/**
 * Načte žebříček pro konkrétní hru (podle nasbíraných bodů v té hře)
 * @param {string} gameId - ID hry (např. 'math-counting')
 * @param {number} limitCount - Počet záznamů
 * @returns {Promise<Array>} - Seznam nejlepších hráčů v dané hře
 */
export const getGameLeaderboard = async (gameId, limitCount = 10) => {
  try {
    // POZOR: Firestore vyžaduje index pro každé pole, podle kterého se řadí.
    // Abychom nemuseli vytvářet index pro každou novou hru (math-addition, math-subtraction...),
    // načteme všechny hráče a seřadíme je v JavaScriptu.
    // Pro školní aplikaci (stovky hráčů) je to výkonnostně v pořádku.
    
    const q = query(collection(db, LEADERBOARD_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    const players = querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          score: data.scores && data.scores[gameId] ? data.scores[gameId] : 0
        };
      })
      .filter(player => player.score > 0) // Only show players who played this game
      .sort((a, b) => b.score - a.score) // Sort descending
      .slice(0, limitCount); // Take top N

    return players;
  } catch (e) {
    console.error(`Chyba při načítání žebříčku pro ${gameId}: `, e);
    return [];
  }
};

/**
 * Načte nejlepší skóre pro danou hru (z historie) - volitelné, pokud chceme "Rekordy"
 * Ale pro školu je lepší ten globální žebříček výše.
 */
export const getTopScores = async (gameId, limitCount = 10) => {
  if (gameId === 'global') {
    return getGlobalLeaderboard('all', limitCount);
  }
  if (gameId === 'global-math') {
    return getGlobalLeaderboard('math', limitCount);
  }
  if (gameId === 'global-czech') {
    return getGlobalLeaderboard('czech', limitCount);
  }
  return getGameLeaderboard(gameId, limitCount);
};
