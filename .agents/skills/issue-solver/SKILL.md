---
name: issue-solver
description: >-
  Pulls open GitHub issues, presents them with T-shirt size estimations and proposed solutions,
  and systematically resolves them (using sub-agents where possible) upon user approval.
---

# Issue Solver Skill

Use this skill when you need to bulk-process or triage open issues in a repository, estimate their complexity, and systematically resolve them.

## Workflow

### 1. Fetch Open Issues
Run a command to fetch the open issues for the current repository. You can use the GitHub CLI for this:
`gh issue list --state open`

### 2. Analyze and Estimate
Analyze each open issue and determine the appropriate T-shirt size estimation based on the following criteria:
*   **S (Small)**: Small bug fixes, typos, single-line changes.
*   **M (Medium)**: Isolated changes, incremental feature additions, contained UI tweaks.
*   **L / XL (Large / Extra Large)**: Fundamental architectural changes, sweeping refactors, complex multi-file features.

Formulate a brief proposed solution for each issue.

### 3. Present the Triage Table
Present a Markdown table directly in your chat response (do not create an artifact) with the following columns:
*   Issue # and Title
*   Proposed Solution
*   T-Shirt Size (S, M, L, XL)

Ask the user to review the table and explicitly approve which issues they would like you to fix.

### 4. Systematically Fix (Iterate or Parallelize)
Once the user selects the issues to fix:
*   If the issues are **independent** with no shared file dependencies, use the `invoke_subagent` tool to spawn sub-agents to work on them in parallel (using `share` workspace mode if available, or independent branches).
*   If the issues have **overlapping dependencies** (e.g., modifying the same files), work on them sequentially to avoid merge conflicts.

For each issue being fixed:
*   Make the necessary code changes.
*   Test or build the code to verify the fix.
*   Commit the changes referencing the issue (e.g., `fix: resolve issue #123`).

### 5. Push and Close
After all approved issues are fixed and committed:
*   Push the changes to the remote repository.
*   If the commit messages don't automatically close the issues (e.g., via `Fixes #123`), use the GitHub CLI to manually close them: `gh issue close <issue-number>`.
*   Report back to the user with a summary of the completed work.
