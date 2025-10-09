<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

Exporting schedules
-------------------

You can export the currently selected schedule as a JSON file using the "Export" button in the Manage Schedules panel. The exported file will be named using the schedule name and id.

Importing schedules
-------------------

Use the "Import" button in the Manage Schedules panel to select a previously exported schedule JSON file. The schedule will be added to your list and selected. If the imported schedule ID conflicts with an existing schedule, a new ID will be generated and "(imported)" will be appended to the schedule name.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1iJdCsF8NwtHEE6XFoGvIrhSzHX9SoSMW

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

**Added pages deployment**
