# Firebot HypeRate Integration Script

### Setup (Users)
1. Download the **hyperateScript.js** file from [the v1.0.0 release](https://github.com/dennisrijsdijk/firebot-plugin-hyperate/releases/tag/v1.0.0).
2. Install the script into your Firebot profile and set it as a Startup Script
3. Go to Settings > Integrations > HypeRate. Enter your Device ID in the ID field and click Save. Use **internal-testing** to receive frequent testing data.
4. The HypeRate script exposes an event `Heartrate` and two variables `$heartrate` (in bpm) and `$heartrateTime` (time since last heartrate event in seconds)

### Setup (Developers)
1. `npm install`
2. Copy the `src/example.auth.ts` file to `src/auth.ts` and enter a HypeRate API Key. You can request a key [here](https://www.hyperate.io/api)


### Building
Dev:
1. `npm run build:dev`
- Automatically copies the compiled .js to Firebot's scripts folder.

Release:
1. `npm run build`
- Copy .js from `/dist`
