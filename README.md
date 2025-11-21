# Škola Hrou

Interaktivní výuková aplikace pro děti na prvním stupni ZŠ.

## Funkce

- 🧮 **Matematika**: Počítání předmětů, sčítání (plánováno), odčítání (plánováno).
- 📖 **Čtení**: (Plánováno)
- 🎉 **Odměny**: Vizuální efekty (konfety) za správné odpovědi.

## Technologie

- **React** (Vite)
- **Tailwind CSS** (v4) - Stylování
- **React Router** - Navigace
- **Canvas Confetti** - Efekty
- **Lucide React** - Ikony

## Jak spustit projekt

1.  Nainstalujte závislosti:
    ```bash
    npm install
    ```

2.  Spusťte vývojový server:
    ```bash
    npm run dev
    ```

3.  Otevřete prohlížeč na adrese zobrazené v terminálu (obvykle `http://localhost:5173`).

## Nasazení na GitHub Pages

Tento projekt je připraven pro automatické nasazení na GitHub Pages pomocí GitHub Actions.

### Postup:

1.  **Vytvořte repozitář na GitHubu** (např. s názvem `app_skola`).
2.  **Upravte konfiguraci:**
    *   Otevřete soubor `vite.config.js`.
    *   Změňte hodnotu `base` na název vašeho repozitáře (např. `base: '/app_skola/'`).
3.  **Nahrajte kód na GitHub:**
    ```bash
    git init
    git add .
    git commit -m "První verze aplikace"
    git branch -M main
    git remote add origin https://github.com/VASE_UZIVATELSKE_JMENO/app_skola.git
    git push -u origin main
    ```
4.  **Nastavte GitHub Pages:**
    *   Jděte na stránku repozitáře na GitHubu.
    *   Klikněte na **Settings** -> **Pages**.
    *   V sekci **Build and deployment** změňte **Source** na **GitHub Actions**.
    *   GitHub automaticky spustí akci a nasadí aplikaci.

## Struktura projektu

- `src/components` - Sdílené komponenty (tlačítka, karty).
- `src/layouts` - Rozložení stránky (hlavička, navigace).
- `src/modules` - Výukové moduly rozdělené podle ročníků a předmětů (např. `grade1/math`).
- `.github/workflows` - Konfigurace pro automatické nasazení.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
