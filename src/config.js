export const GameConfig = {
  maxNumber: 10, // Zde stačí přepsat na 50, 100, atd.
  
  czech: {
    // Písmena, která už děti znají. Hry budou generovat obsah pouze z těchto písmen.
    // Stačí přidat nové písmeno do řetězce (např. "MALESO" -> "MALESOP").
    // Nerozlišuje se velikost písmen (a=A).
    allowedLetters: "M A L E S O P U I N T V K", 
  }
};

// Pomocná funkce pro zjištění, zda slovo obsahuje pouze povolená písmena
export const isContentAllowed = (text) => {
  if (!text) return false;
  
  // Odstraníme mezery a převedeme na velká písmena
  const cleanText = text.toUpperCase().replace(/\s/g, '');
  const allowed = GameConfig.czech.allowedLetters.toUpperCase();
  
  // Mapa pro automatické povolení dlouhých samohlásek a měkkého E
  // Pokud učitel zadá 'A', automaticky tím povolí i 'Á'.
  // Souhlásky s háčkem (Š, Č, Ř, Ž...) se musí zadat explicitně!
  const VOWEL_MAP = {
    'Á': 'A', 
    'É': 'E', 'Ě': 'E', 
    'Í': 'I', 
    'Ó': 'O', 
    'Ú': 'U', 'Ů': 'U', 
    'Ý': 'Y'
  };
  
  for (let char of cleanText) {
    // Ignorujeme znaky, které nejsou písmena
    if (char.toLowerCase() === char.toUpperCase()) continue; 

    // 1. Je znak přímo v povolených? (např. 'A' je v 'A B C')
    if (allowed.includes(char)) continue;

    // 2. Je to dlouhá samohláska, jejíž základ je v povolených? (např. 'Á' -> 'A' je v 'A B C')
    const baseChar = VOWEL_MAP[char];
    if (baseChar && allowed.includes(baseChar)) continue;

    // Pokud ani jedno, znak není povolen
    return false;
  }
  
  return true;
};