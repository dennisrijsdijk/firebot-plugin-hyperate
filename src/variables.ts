import type { ReplaceVariable } from "@crowbartools/firebot-types";

let rate: number = 0;
let time: number = 0;

export function updateHeartRateValues(newRate: number, newTime: number) {
    rate = newRate;
    time = newTime;
}

const heartrateVariable: ReplaceVariable = {
    definition: {
        description: "HypeRate's last reported heart rate in bpm.",
        handle: "heartrate",
        possibleDataOutput: ["number"]
    },
    evaluator(): number {
        return rate;
    }
}

const heartrateTimeVariable: ReplaceVariable = {
    definition: {
        description: "The time in seconds since the last heartbeat from HypeRate",
        handle: "heartrateTime",
        possibleDataOutput: ["number"]
    },
    evaluator(): number {
        return Math.round(Date.now() / 1000 - time);
    }
}

export default [
    heartrateTimeVariable,
    heartrateVariable
];