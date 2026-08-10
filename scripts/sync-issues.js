/**
 * sync-issues.js
 * 
 * A local cron script that reads bug reports from the public Firebase Firestore 
 * and pushes them to GitHub Issues, then deletes them from Firebase to avoid duplicates.
 * 
 * Setup:
 * 1. Generate a GitHub Personal Access Token (PAT) with 'repo' access.
 * 2. Run: export GITHUB_TOKEN="your_token"
 * 3. Run: node scripts/sync-issues.js
 * 
 * To automate, add to your local crontab (`crontab -e`):
 * */5 * * * * GITHUB_TOKEN="your_token" /usr/local/bin/node /Users/guym/projects/Asaf-Family-Trip/scripts/sync-issues.js
 */

const PROJECT_ID = "family-trip-e19ea";
const GITHUB_REPO = "guym/Asaf-Family-Trip";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function sync() {
  if (!GITHUB_TOKEN) {
    console.error("Missing GITHUB_TOKEN environment variable.");
    process.exit(1);
  }

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
      
      // 3. Create GitHub Issue
      const githubRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `[App Bug] ${title}`,
          body: desc
        })
      });

      if (!githubRes.ok) {
        console.error(`Failed to create GitHub issue for ${title}:`, await githubRes.text());
        continue;
      }

      console.log(`Successfully created GitHub issue: ${title}`);

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
