# Škola Hrou

Interaktivní výuková aplikace pro děti na prvním stupni ZŠ. Aplikace je navržena tak, aby byla zábavná, jednoduchá na ovládání a vizuálně atraktivní pro děti.

## 🎮 Funkce a Hry

### 1. Třída - Matematika
- 🍎 **Počítání**: Základní počítání předmětů (jablíčka).
- ➕ **Sčítání**: Sčítání dvou čísel do X (nastavitelné).
- ➖ **Odčítání**: Odčítání dvou čísel do X.
- ⚖️ **Porovnávání**: Určování vztahů větší, menší, rovná se.
- 🎴 **Pexeso**: Hledání párů (příklad + výsledek).
- 🏠 **Domečky**: Rozklad čísel (např. 5 = 2 + 3).
- 📏 **Číselná osa**: Řazení čísel na osu (klikací interakce).
- 🔺 **Tvary**: Poznávání geometrických tvarů (drag & drop).
- ⏰ **Hodiny**: Poznávání času (ručičkové i digitální).
- 💰 **Peníze**: Nakupování a placení mincemi.

### 1. Třída - Čeština
- 🅰️ **Písmenka**: Párování velkých a malých písmen, tiskacích a psacích.
- 🗣️ **Slabiky**: Čtení a párování slabik (MA - ma).
- 📖 **Slova**: Čtení slov a přiřazování k obrázkům (PES - 🐶).
- 🧩 **Skládání**: Skládání slov ze slabik (AU-TO).
- ✏️ **Doplňovačka**: Doplňování chybějících slov do vět.

### 1. Třída - Logika
- 🏁 **Řádky a sloupce**: Orientace v mřížce (5x5). Hledání souřadnic a políček.

### Gamifikace 🏆
- **Ukládání skóre**: Hráči si mohou uložit své výsledky pod svým jménem.
- **Žebříčky**:
  - **Lokální**: Zobrazuje se přímo ve hře pro danou aktivitu.
  - **Globální**: Celkový žebříček pro Matematiku, Češtinu a Logiku ("Mistři").
- **Odměny**: Vizuální efekty (konfety) za správné odpovědi a dokončení úrovní.

## 🛠️ Technologie

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Stylování**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Navigace**: [React Router v7](https://reactrouter.com/)
- **Backend**: [Firebase Firestore](https://firebase.google.com/) (NoSQL databáze)
- **Ikony**: [Lucide React](https://lucide.dev/)
- **Efekty**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

## 🚀 Instalace a Spuštění

### Prerekvizity
- **Node.js** (verze 18 nebo novější)
- **npm** (součást Node.js)

### Postup

1.  **Naklonujte repozitář:**
    ```bash
    git clone <URL_REPOZITARE>
    cd app_skola
    ```

2.  **Nainstalujte závislosti:**
    ```bash
    npm install
    ```

3.  **Nastavte prostředí (Environment Variables):**
    Vytvořte soubor `.env` v kořenovém adresáři a přidejte konfiguraci pro Firebase (viz sekce Firebase níže):
    ```env
    VITE_FIREBASE_API_KEY=vase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=vas_projekt.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=vas_projekt_id
    VITE_FIREBASE_STORAGE_BUCKET=vas_projekt.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=vase_sender_id
    VITE_FIREBASE_APP_ID=vase_app_id
    ```

4.  **Spusťte vývojový server:**
    ```bash
    npm run dev
    ```
    Aplikace poběží na `http://localhost:5173`.

### Dostupné skripty
- `npm run dev`: Spustí lokální vývojový server.
- `npm run build`: Vytvoří produkční build do složky `dist`.
- `npm run preview`: Spustí náhled produkčního buildu.
- `npm run lint`: Zkontroluje kvalitu kódu pomocí ESLint.

## ⚙️ Konfigurace

Hlavní nastavení aplikace se nachází v `src/config.js`.

- **maxNumber**: Globální nastavení maximálního čísla pro matematické operace (např. 20). Změna této hodnoty automaticky upraví obtížnost her jako Sčítání, Odčítání, Porovnávání a Číselná osa.

## 🔥 Firebase Nastavení

Aplikace využívá **Firebase Firestore** pro ukládání výsledků.

### Struktura Databáze

1.  **Kolekce `scores_history`**:
    - Loguje každou odehranou hru.
    - Dokument obsahuje: `playerName`, `gameId`, `score`, `timestamp`.

2.  **Kolekce `leaderboard`**:
    - Agregované výsledky pro každého hráče.
    - ID dokumentu = `playerName` (lowercase).
    - Dokument obsahuje:
        - `totalScore`: Celkové skóre ze všech her.
        - `totalScoreMath`: Skóre z matematiky.
        - `totalScoreCzech`: Skóre z češtiny.
        - `totalScoreLogic`: Skóre z logiky.
        - `scores`: Objekt s nejlepšími výsledky pro jednotlivé hry (např. `{'math-addition': 15}`).

### Pravidla (Firestore Rules)
Pro vývoj a testování jsou pravidla nastavena benevolentně. Pro produkci doporučujeme omezit zápis pouze na validní data.

## 📂 Struktura Projektu

```
src/
├── assets/          # Statické soubory (obrázky, fonty)
├── components/      # Sdílené komponenty (Leaderboard, Home)
├── layouts/         # Rozložení stránky (Layout.jsx - hlavička, navigace)
├── modules/         # Hlavní logika her
│   ├── grade1/      # Hry pro 1. třídu
│   │   ├── czech/   # Čeština (LettersGame, WordsGame...)
│   │   ├── math/    # Matematika (AdditionGame, ClockGame...)
│   │   └── logic/   # Logika (RowsColumnsGame...)
├── services/        # Komunikace s API/Firebase (scoreService.js)
├── App.jsx          # Hlavní směrovač (Router)
├── config.js        # Globální konfigurace
├── firebase.js      # Inicializace Firebase
└── main.jsx         # Vstupní bod aplikace
```

## 🌍 Nasazení (Deployment)

Aplikace je připravena pro nasazení na statický hosting (GitHub Pages, Vercel, Netlify).

### GitHub Pages
Projekt obsahuje workflow pro GitHub Actions. Stačí nastavit v repozitáři:
1.  `Settings` -> `Pages` -> `Source`: **GitHub Actions**.
2.  Ujistěte se, že v `vite.config.js` je správně nastaveno `base` (pokud neběží na kořenové doméně).

## 🤝 Jak přidat novou hru

1.  Vytvořte novou komponentu v příslušné složce (např. `src/modules/grade1/math/NewGame.jsx`).
2.  Použijte sdílené komponenty a styly pro zachování konzistence (viz existující hry).
3.  Přidejte routu do `src/App.jsx`.
4.  Přidejte odkaz na hru do příslušného dashboardu (např. `MathDashboard.jsx`).
5.  Pro ukládání skóre použijte funkci `saveScore` z `scoreService.js` s unikátním ID hry.

---
*Vytvořeno pro radost z učení.* ❤️
