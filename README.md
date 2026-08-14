# Asaf Family Trip App 🌍

A beautiful, bilingual (Hebrew & English) React/Vite progressive web app designed to act as a centralized hub for the Asaf Family Trip to Budapest and Slovakia (Aug 20 - 29, 2026).

## Features
- **Live Weather Forecast**: Uses Open-Meteo API to fetch 16-day forecasts for Budapest & Tatralandia.
- **Bilingual Interface**: Full i18n support (English / Hebrew) with dynamic LTR/RTL layout mirroring.
- **Smart Itinerary**: Outlook-style interactive calendar grid for overlapping events, and a simple Feed view.
- **Document Hub**: Centralized place to track flight PNRs, hotel bookings, and rental agreements.
- **Interactive Guidebook**: Google Maps deep-links for instantly dropping pins onto family members' native Maps apps.
- **Route Guard**: Simple password-based local authentication (`12345678`) that persists via `localStorage`.

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
4. Enter password `12345678` to access the hub.

## Deployment (Firebase)
This app is currently configured for deployment on Firebase Hosting.
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy to Firebase:
   ```bash
   npx firebase deploy
   ```
The live site is available at: [https://family-trip-e19ea.web.app](https://family-trip-e19ea.web.app)

## Local Scripts & Automation
The project contains utility scripts in the `scripts/` folder designed to be run locally using Node.js.

### GitHub Issue Sync (`sync-issues.js`)
Users can submit bug reports directly from the app interface. To keep the app simple for non-technical family members, these are stored in Firebase. 
This script fetches the reports from Firebase, creates GitHub issues using the `gh` CLI, and deletes the reports from Firebase.

**Requirements:**
- GitHub CLI installed and authenticated (`gh auth login`)
- Node.js installed

**Usage:**
Run the script manually:
```bash
node scripts/sync-issues.js
```

**Automate it (Cron):**
You can set this script to run automatically (e.g. every 5 minutes) via your local crontab:
```bash
crontab -e
# Add the following line (adjust paths as needed):
*/5 * * * * /usr/local/bin/node /Users/guym/projects/Asaf-Family-Trip/scripts/sync-issues.js
```
