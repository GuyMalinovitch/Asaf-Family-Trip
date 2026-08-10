/**
 * sync-issues.js
 * 
 * A local cron script that reads bug reports from the public Firebase Firestore 
 * and pushes them to GitHub Issues, then deletes them from Firebase to avoid duplicates.
 * 
 * Setup:
 * 1. Ensure you are logged into the GitHub CLI (`gh auth login`).
 * 2. Run: node scripts/sync-issues.js
 * 
 * To automate, add to your local crontab (`crontab -e`):
 * */5 * * * * /usr/local/bin/node /Users/guym/projects/Asaf-Family-Trip/scripts/sync-issues.js
 */

const { execSync } = require('child_process');

const PROJECT_ID = "family-trip-e19ea";
const GITHUB_REPO = "guym/Asaf-Family-Trip";

async function sync() {

  try {
    // 1. Fetch reports from Firestore REST API
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/reports`;
    const res = await fetch(firestoreUrl);
    
    if (res.status === 404) {
      console.log("No reports collection found (empty).");
      return;
    }
    
    const data = await res.json();
    if (!data.documents || data.documents.length === 0) {
      console.log("No new reports to sync.");
      return;
    }

    console.log(`Found ${data.documents.length} reports to sync.`);

    // 2. Loop through each report
    for (const doc of data.documents) {
      const title = doc.fields.title?.stringValue || "Untitled Issue";
      const desc = doc.fields.description?.stringValue || "No description provided.";
      
      // 3. Create GitHub Issue using `gh` CLI
      try {
        // Passing arguments via environment variables to safely handle quotes/special characters
        execSync(`gh issue create --repo "${GITHUB_REPO}" --title "$ISSUE_TITLE" --body "$ISSUE_BODY"`, {
          env: { 
            ...process.env, 
            ISSUE_TITLE: `[App Bug] ${title}`, 
            ISSUE_BODY: desc 
          },
          stdio: 'inherit'
        });
        console.log(`Successfully created GitHub issue: ${title}`);
      } catch (err) {
        console.error(`Failed to create GitHub issue for ${title}`);
        continue;
      }

      // 4. Delete the document from Firestore so we don't sync it again next time
      const docPath = doc.name; // e.g. projects/.../documents/reports/XYZ
      const deleteRes = await fetch(`https://firestore.googleapis.com/v1/${docPath}`, {
        method: 'DELETE'
      });

      if (deleteRes.ok) {
        console.log(`Deleted report from Firebase: ${docPath.split('/').pop()}`);
      }
    }
    
    console.log("Sync complete!");

  } catch (err) {
    console.error("Sync failed:", err);
  }
}

sync();
