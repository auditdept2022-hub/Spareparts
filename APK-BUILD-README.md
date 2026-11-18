# Parts Inventory: GitHub APK builder

Every time you push to `main` (or `master`) GitHub builds a signed Android APK of your app and
publishes it on your repository's **Releases** page as `Parts-Inventory.apk`.

## One-time setup
1. Put ALL files from this package in the ROOT of your GitHub repo (same place as `index.html`):
   - `index.html`, `sw.js`, `manifest.webmanifest`, the `*.png` icons
   - `package.json`, `package-lock.json`, `capacitor.config.json`, `.gitignore`
   - folders: `android-assets/`, `signing/`, `.github/workflows/` (contains `build-apk.yml`)
   - `Code.gs` and `README.txt` are only for your records / Apps Script
   Tip (website upload): hidden folders such as `.github` are easiest to add with
   "Add file > Create new file", typing `.github/workflows/build-apk.yml` as the name and pasting the file.
2. In the repo go to **Settings > Actions > General > Workflow permissions** and choose
   **Read and write permissions**, then Save. (Needed to publish the APK to Releases.)
3. Commit. Open the **Actions** tab: "Build Android APK" starts (about 5-10 minutes the first time).

## Get the APK on your phone
- Open your repo on the phone > **Releases** > "Parts Inventory APK (latest)" > download
  `Parts-Inventory.apk` > open it > allow "Install unknown apps" for your browser if asked > Install.
- You can also run it any time from **Actions > Build Android APK > Run workflow**.
- The same file is available as a workflow artifact (zip) on each run.

## Updating the app
Edit `index.html` (or any web file), commit, wait for the build, download and install the new
APK over the old one. Your local data stays because the signing key is always the same.
Normal edits to `Code.gs` (Google side) do not need a rebuild.

## Things to know
- The APK contains a copy of your web files, so the app opens even with no signal. Data syncing
  still goes to your Google Sheet through the Apps Script URL in `index.html`.
- Export CSV in the APK opens the phone's Share sheet (save to Drive, send, etc.).
- App id `com.partsinventory.app`, name "Parts Inventory": change them in `capacitor.config.json`.
- Signing: by default it uses `signing/parts-inventory.keystore` (password `parts-inventory`,
  alias `partsinventory`). That is fine for your own team's private app, but not secret and not
  for Google Play. To use your own key add repo secrets `ANDROID_KEYSTORE_BASE64`,
  `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (and optional `ANDROID_KEY_PASSWORD`).
  Phones refuse to update an app signed with a different key, so uninstall the old APK first
  if you ever change keys (export or sync your data first).
