import firebot, { EventSource } from "@crowbartools/firebot-types";

export const eventSource: EventSource = {
    id: "hyperate",
    name: "HypeRate",
    description: "Heartrate Events for HypeRate",
    events: [
        {
            id: "heartrate",
            name: "Heartrate",
            description: "When HypeRate sends your heartrate.",
            manualMetadata: {
                rate: 80
            },
            activityFeed: {
                icon: "fad fa-heartbeat",
                getMessage: (data: unknown) => {
                    const eventData = data as { rate: number }
                    return `Received heartrate event from HypeRate: ${eventData.rate} bpm.`;
                }
            }
        }
    ]
}

export function triggerHeartRate(rate: number) {
    firebot.events.trigger("hyperate", "heartrate", {rate: rate});
}