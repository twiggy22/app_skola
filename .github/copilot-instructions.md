<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Project Context: Škola Hrou
This project is a React application for primary school education ("Škola Hrou").

## Tech Stack
- **Framework**: React + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Effects**: Canvas Confetti

## Project Structure
- `src/modules/grade1/math/`: Contains all math games for 1st grade.
- `src/config.js`: Global configuration (e.g., `maxNumber` for difficulty).
- `src/layouts/`: Shared layouts (navigation, etc.).

## Implemented Games (Grade 1 Math)
1.  **CountingGame**: Basic counting.
2.  **AdditionGame**: Sums up to `maxNumber`.
3.  **SubtractionGame**: Subtraction within `maxNumber`.
4.  **ComparisonGame**: `< > =` logic.
5.  **MemoryGame**: Math pairs (equation + result).
6.  **DecompositionGame**: Number decomposition ("Domečky").
7.  **NumberLineGame**: Drag & drop numbers onto a line. Supports horizontal scroll on mobile.
8.  **GeometryGame**: Shape recognition. Uses **Drag & Drop** for better mobile UX (touch-none container).
9.  **ClockGame**: Analog/Digital time. Custom SVG clock component.
10. **MoneyGame**: Shopping simulation with coins.

## Design Guidelines
- **Mobile First**: All games must be responsive.
- **Touch Friendly**: Use large touch targets.
- **Visual Feedback**: Use confetti for success, shake animations for errors.
- **Simple UI**: Minimal text, icons preferred (target audience: 6-7 year olds).