import { eventSource } from "./events";
import hyperateLogo from "./hyperate-logo.svg";
import integration from "./integration"; "./integration";
import { Plugin } from "@crowbartools/firebot-types";
import variables from "./variables";

const plugin: Plugin = {
  manifest: {
    name: "Hyperate",
    version: PLUGIN_VERSION,
    author: "DennisOnTheInternet",
    description: "Hyperate heartrate events for Firebot",
    tags: [
      "heartrate",
      "hyperate",
      "events"
    ],
    repo: "https://github.com/dennisrijsdijk/firebot-plugin-hyperate",
    minimumFirebotVersion: {
      major: 5,
      minor: 67,
      patch: 0
    },
    icon: {
      type: "custom",
      url: `data:image/svg+xml;base64,${hyperateLogo}`
    }
  },
  registers: {
    eventSources: [
      eventSource
    ],
    integrations: [
      integration
    ],
    variables
  },
  onUnload: integration.integration.disconnect!
}

export default plugin;