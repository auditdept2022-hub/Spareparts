PARTS INVENTORY — IMPORT PROGRESS, CANCELLATION & SYNC PERFORMANCE UPDATE

PACKAGE CONTENTS
- CHANGE: Mobile sort dropdown removed (sorting stays on the desktop column arrows). Cache v21.
- NEW: Mobile: the search bar is always visible; the filter/date/sort/import/export/add-part area hides behind a "Filters & actions" bar (remembers your choice; dot shows when a filter or sort is active). Cache v20.
- NEW: Spare Parts logo used as site logo, favicon, home-screen (app) icon. Mobile list no longer shows the SRP/cost details dropdown. Upload all files incl. the PNG icons. Cache v18.
- NEW: Count dates can be extended. Press "+ Date" next to the date selector, pick a day (it suggests the day after the last one) and a new Count + Counted By column pair is created in the Inventory sheet; every device gets the new date automatically. Requires redeploying Code.gs. Cache v17.
- FIX: Profile / Counted by. The app now records who counted (active profile) on the device immediately and applies the saved record returned by Google (Code.gs now returns it), so the Profile column and the "Counted by" totals update. The Profile column shows who counted the selected date. Counts entered earlier with no counter recorded stay blank until re-saved. Redeploy Code.gs. Cache v16.
- UPDATE: Column headers have ▲/▼ sort arrows (click an arrow, or the header to toggle). Sort A-Z and Backup JSON buttons removed. Mobile has a Sort dropdown. Cache v15.
- UPDATE: Balance highlight. Rows turn green (Balanced), yellow (Over) or red (Short) in the app and on the Inventory sheet itself (conditional formatting on the Status column, applied once automatically; or run applyBalanceHighlight() in Apps Script). Redeploy Code.gs as a New version. Cache v14.
- UPDATE: Filter now has Balanced, Over and Short options (cache v13).
- UPDATE: Compact layout (tighter spacing on desktop and mobile; cache v12).
- UPDATE: Parts list rows (table and mobile cards) are now fully clickable and open the edit/count form. The Edit, Count buttons and Actions column were removed. sw.js cache is v11.
- index.html: visible file-reading progress, import progress, cancel-import control, pause/resume for normal pending sync, optimized request-size batching, local queue persistence, and confirmation-based progress
- Code.gs: faster existing-record lookup and import responses that return their current revision cursors with confirmed records
- sw.js: cache version v10 so devices fetch the updated app shell
- manifest.webmanifest: app manifest
- 789.xlsx: the workbook previously supplied for testing

IMPORT EXPERIENCE
- Shows a progress panel as soon as a file is selected.
- Excel/CSV/JSON file reading reports file-loading progress where the browser provides byte progress.
- Excel parser loading, workbook processing, column validation, and upload are shown as separate stages.
- The Cancel import button is available while preparing and uploading.
- During an active Google Apps Script request, cancellation waits for that one request to return. The app then stops before starting the next batch. This avoids pretending that a request already accepted by Google can be cancelled remotely.
- Rows already confirmed by Google Sheets remain saved. Unsent import batches are removed on cancellation.
- If a request times out during cancellation, its outcome may be uncertain. Re-importing the same workbook is safe for catalog fields because the importer matches existing blank-location catalog records rather than creating duplicate rows.
- Imports are split by both row count (up to 40) and estimated URL size (under about 7,000 characters) to keep JSONP requests within a safer URL range. The Apps Script endpoint accepts up to 50 records per batch.
- The complete batch queue is persisted once before upload; it is no longer written repeatedly to localStorage for every queued batch.

SYNC EXPERIENCE
- NEW: Continuous auto-retry. If an import batch fails or times out, the app keeps re-sending that same batch automatically (pause grows 3s, 6s, 9s ... up to 30s) until Google confirms it, then carries on with the remaining batches. A countdown and the reason are shown. It also waits while offline and resumes by itself. Press Cancel import or Cancel all sync to stop. Safe because rows are matched by Part no., never duplicated.
- FIX (Code.gs): The duplicate Part no. + Location rule on the Inventory tab is now REMOVED instead of turned into a warning. It caused the red "Invalid: This cell's contents violate its validation rule" marks on every blank-Location row and slowed each import write (it recalculated over the whole column), which is why imports stalled partway. Duplicates are still prevented by the app. To clear the marks immediately, run removeDuplicateValidation() once in the Apps Script editor; otherwise it clears itself at the start of the next import. Redeploy a New version after pasting Code.gs.
- FIX (Code.gs): The Inventory sheet had a "reject input" duplicate rule on Part no. / Location. Google threw "This Part no. + Location combination already exists" during bulk import writes, so batch 1 failed. The rule is now a warning, applied automatically once at the start of the next import. The app still blocks duplicates itself. You MUST redeploy Code.gs (Deploy > Manage deployments > Edit > New version > Deploy).
- After redeploying, press Retry in the Import panel; the 31 queued batches resume without re-selecting the file.
- NEW: "Test connection" button in the Import panel. It sends one harmless request to Google and reports the exact problem (old Code.gs deployed, access/PIN problem, unreachable URL, timeout) with the fix. While an import batch is waiting, the panel shows how many seconds it has waited.
- FIX: Import batches now wait up to 75 seconds (was 25) and a batch that times out or fails is re-sent automatically up to 3 more times with a short pause. This is safe because imported rows are matched by Part no., never duplicated. A visible "retrying" message shows while this happens.
- Cancel all sync / Import-with-pending-changes no longer wipes the local cache before reloading, so your inventory stays visible if the reload fails.
- FIX: Import no longer says "Synchronize pending changes first". If unsent local changes exist, Import offers to discard them (after confirmation), reloads the latest data from Google Sheets, then opens the file picker.
- NEW: "Cancel all sync" button (in the sync bar and in the Import panel). After a confirmation it discards every unsent queued change and import batch, clears the import state, and reloads the latest inventory from Google Sheets so you can retry from a clean state. Anything Google already confirmed stays saved. A request already sent to Google cannot be recalled, but its late response is ignored.
- Normal queued edits show a dedicated sync status.
- Pause sync stops after the current server request and retains all unsent changes on the device. Resume sync continues the queue.
- Sync now resumes a paused queue immediately.
- The app never discards regular pending edits when sync is paused.
- Import responses return the confirmed rows and matching revision cursors so the client applies the rows directly and avoids immediately downloading those same import events again.
- Existing-record saves locate rows by the Part no. and Location columns, then read only the selected inventory row. This reduces unnecessary sheet reads as the inventory grows.

IMPORT FIELDS
Only Part no., Part Description, SRP, Cost, and End Inv. are imported. On new catalog rows, location, profile, dates, Status, Balance, counted-by fields, Remarks, and version metadata remain blank.
The Google Sheets destination tab is Inventory.

INSTALLATION
1. Extract this ZIP.
2. In GitHub, replace index.html and sw.js with the files from this package, then commit/push.
3. In the Google Apps Script project connected to the spreadsheet, replace the entire Code.gs and Save.
4. Run setupInventory() and authorize it if this is not already set up. This creates/configures required tabs and protections without overwriting an already populated Inventory tab.
5. Run installInventoryTrigger() if the edit trigger has not already been installed.
6. Deploy > Manage deployments > Edit > New version > Deploy. Keep the deployment URL that is configured in index.html.
7. Close and reopen each app tab/device once so service worker cache v10 activates.
8. Test a small import first. Confirm accepted counts in the Import panel and in the Inventory tab.

IMPORTANT
- A batch that Google Apps Script has already received cannot be reliably cancelled from the browser. Cancel import lets the active request finish, then stops all later batches.
- Pause sync retains normal pending edits locally; it does not delete them.
- The package was checked locally for JavaScript syntax, Apps Script syntax, URL batch sizing, and mocked import/save behavior. It has not been connected to or tested against the live Google spreadsheet from this environment.
