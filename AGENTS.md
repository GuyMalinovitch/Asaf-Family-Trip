---
description: Context and guidelines for AI agents working on the Asaf Family Trip project.
---

# Asaf Family Trip - Agent Guidelines

Welcome to the Asaf Family Trip codebase! This file contains essential context and architectural rules to help you assist the user effectively.

## Project Context
- **Goal**: A responsive, mobile-first web application for the Asaf family trip to Budapest and Slovakia (August 20 - 29, 2026).
- **Tech Stack**: React 18, Vite, React Router v7, `react-i18next` for translations.
- **Styling**: Standard CSS Modules and global CSS (`index.css`). **Do not use Tailwind CSS** unless explicitly authorized by the user. The aesthetic should be premium, utilizing "glassmorphism" panels, gradients, and vibrant UI elements.
- **Backend/Deployment**: The app is hosted on **Firebase Hosting** and uses **Firebase Firestore** for dynamic data (Project ID: `family-trip-e19ea`). 

## Key Technical Decisions
1. **State & Auth**: Authentication is a simple thin route guard using a hardcoded password (`12345678`). The auth state is persisted in `localStorage('familyTripAuth')`.
2. **Internationalization (i18n)**: The app supports English (LTR) and Hebrew (RTL). `src/i18n.js` handles translations and dynamically updates `document.documentElement.dir` to flip the UI. Ensure any new layout CSS uses logical properties (e.g., `insetInlineStart`, `borderInlineEnd`) instead of hardcoded `left`/`right` so it mirrors correctly in RTL mode.
3. **Weather**: Fetches live data directly from the free Open-Meteo API in `Home.jsx`.
4. **Maps**: `Guidebook.jsx` uses direct Universal Google Maps search links (e.g., `https://www.google.com/maps/search/?api=1&query=...`) instead of iframes so that they open directly in the user's native mobile app.

## Workflow Rules
1. **Building**: Always run `npm run build` after making structural or content changes, as the user deploys the `dist/` folder via Firebase.
2. **Deploying**: Remind the user to run `npx firebase deploy` if they want to publish changes.
3. **Data**: The trip's baseline structure (days and dates) is defined in `src/i18n.js` to support multi-language translation. The actual itinerary events are stored and managed in **Firebase Firestore** (`itinerary_events` collection).
