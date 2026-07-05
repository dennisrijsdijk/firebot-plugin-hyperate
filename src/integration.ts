import { triggerHeartRate } from "./events";
import firebot from "@crowbartools/firebot-types";
import type { IntegrationData, IntegrationDefinition, Integration, IntegrationController } from "@crowbartools/firebot-types";
import { EventEmitter } from "events";
import { HYPERATE_WEBSOCKET_TOKEN } from "./auth";
import { updateHeartRateValues } from "./variables";

const definition: IntegrationDefinition = {
    id: "hyperate",
    name: "HypeRate",
    description: "Heartrate events",
    connectionToggle: true,
    linkType: "id",
    idDetails: {
        steps:
            `Get your HypeRate ID and put it in the ID field. Use internal-testing for test data. Press Save and activate the integration in the bottom left of the screen.`
    },
    settingCategories: {}
};

class HypeRateIntegration extends EventEmitter implements IntegrationController {
    connected: boolean;
    _socket?: WebSocket;
    _heartbeat?: NodeJS.Timeout;
    _stopping = false;
    reconnectAttempts: number;
    constructor() {
        super();
        this.connected = false;
        this.reconnectAttempts = 0;
    }

    init() { }

    async connect(integrationData: IntegrationData) {
        const { accountId } = integrationData;

        if (accountId == null || accountId === "") {
            firebot.logger.debug("Empty ID provided, disconnecting integration");
            this.emit("disconnected", definition.id);
            return;
        }

        this._stopping = false;

        this._socket = new WebSocket("wss://app.hyperate.io/socket/websocket?token=" + HYPERATE_WEBSOCKET_TOKEN);

        function sendHeartbeat(socket: WebSocket) {
            socket.send(JSON.stringify({
                topic: "phoenix",
                event: "heartbeat",
                payload: {},
                ref: 0
            }));
        }

        this._socket.onopen = () => {
            if (!this._socket) {
                return;
            }

            this._socket.send(JSON.stringify({
                topic: "hr:" + accountId,
                event: "phx_join",
                payload: {},
                ref: 0
            }));

            this._heartbeat = setInterval(sendHeartbeat, 9000, this._socket);
            this.connected = true;
            this.reconnectAttempts = 0
            this.emit("connected", definition.id);
        };

        this._socket.onerror = (event) => {
            if (this._stopping) {
                return;
            }

            firebot.logger.error("Websocket error received: ", ((event as ErrorEvent).error as Error).message);

            this.disconnect();
            this.reconnect();
        };

        this._socket.onmessage = (event: MessageEvent<string>) => {
            const response: {
                event: string;
                payload: {
                    hr: number;
                }
            } = JSON.parse(event.data);

            if (response.event === "hr_update") {
                updateHeartRateValues(response.payload.hr, Date.now() / 1000);
                triggerHeartRate(response.payload.hr);
            }
        };

        this._socket.onclose = (event) => {
            if (event.code !== 3000) {
                this.disconnect();
                this.reconnect();
            }
        }
    }

    reconnect() {
        if (this.reconnectAttempts === 3) {
            firebot.logger.warn("Attemped to reconnect to HypeRate 3 times, setting integration to disconnected...");
            this.reconnectAttempts = 0;
            this.disconnect();
            return;
        }

        this.reconnectAttempts++;

        setTimeout(() => this.emit("reconnect", definition.id), (Math.pow(3, this.reconnectAttempts) - 1) * 1000);
    }

    disconnect() {
        if (this._socket == null || this._socket.readyState === WebSocket.CLOSED) {
            return;
        }
        this._stopping = true;
        this._socket.close(3000, "Purposeful Disconnect");
        this.connected = false;
        clearInterval(this._heartbeat);

        this.emit("disconnected", definition.id);
    }

    link() { }

    async unlink() {
        if (this._socket) {
            this.disconnect();
        }
    }
}

const integration: Integration = {
    definition,
    integration: new HypeRateIntegration()
};

export default integration;