import { logger } from "@oceanity/firebot-helpers/firebot";
import * as WebSocket from "ws";
import { stringifyPayload, veadotubePayloads } from "./messages";
import { getErrorMessage } from "@oceanity/firebot-helpers/string";
import { v4 as uuidv4 } from "uuid";

const RECONNECT_INTERVAL = 5000;
const STATE_ID = uuidv4();

let connected = false;
let ws: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;

export let states: VeadotubeState[] = [];
export let instanceType: string | null = null;

type PendingRequest = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}
const pendingRequests: Record<string, PendingRequest[] | null> = {};

async function maintainConnection(serverAddress: string, type?: VeadotubeInstanceType) {
  if (type) instanceType = type;

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  if (!connected) {
    try {
      if (ws) {
        ws.removeAllListeners();
        ws.close();
        ws = null;
      }

      ws = new WebSocket(`ws://${serverAddress}?n=OceanityFirebotScript`);

      ws.on("open", () => {
        logger.info("Connected to Veadotube Server");
        connected = true;

        ws?.send(stringifyPayload(veadotubePayloads.Listen(STATE_ID)));
      });

      ws.on("error", (error) => {
        logger.error("Error connecting to Veadotube Server", error);
        connected = false;
        reconnectTimeout = setTimeout(() => maintainConnection(serverAddress), RECONNECT_INTERVAL);
      });

      ws.on("close", () => {
        logger.error("Disconnected from Veadotube Server");
        connected = false;
        reconnectTimeout = setTimeout(() => maintainConnection(serverAddress), RECONNECT_INTERVAL);
      });

      ws.on("message", (data: WebSocket.Data) => {
        const message = parseResponseData(data);

        if (!message) return;

        const request = pullPromise(getNamespaceFromEvent(message));

        if (request) request.resolve(message);
      });
    } catch (error) {
      logger.error("Unexpected error in maintainConnection", error);
    }
  }
}

export function initRemote(serverAddress: string, instanceType: VeadotubeInstanceType) {
  maintainConnection(serverAddress, instanceType);
}

export async function getStates() {
  try {
    const statesResponse = await call<VeadotubeStateListResponse>("ListStates", "avatar state:list");
    states = statesResponse.payload.states;
    console.log("getStates", statesResponse);
    return statesResponse.payload.states;
  } catch (error) {
    logger.error(getErrorMessage(error));
  }
}

export async function setState(stateId: string) {
  try {
    const statesResponse = await call<VeadotubeAvatarStatePeekResponse>("SetState", "avatar state:peek", stateId);
    console.log("setState", statesResponse);
    return states.find(s => s.id === stateId);
  } catch (error) {
    logger.error(getErrorMessage(error));
  }
}

// Helper functions
function call<T>(method: keyof typeof veadotubePayloads, namespace: VeadotubeNamespace, token?: string): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!connected || !ws) {
      resolve([] as unknown as T);
      return;
    }

    const payload = veadotubePayloads[method](token as string);
    storePromise(namespace, resolve, reject);
    ws.send(stringifyPayload(payload));
  });
}

function storePromise(namespace: VeadotubeNamespace, resolve: (value: any) => void, reject: (reason?: any) => void) {
  if (!pendingRequests[namespace]) {
    pendingRequests[namespace] = [];
  }
  
  pendingRequests[namespace].push({ resolve, reject });
}

function pullPromise(name: VeadotubeNamespace) {
  if (!pendingRequests[name] || !pendingRequests[name].length) {
    return null;
  }
  return pendingRequests[name].shift();
}

function parseResponseData(data: WebSocket.Data) {
  const dataString = data.toString()
    .replace(/.*nodes:/, "")
    .replace(/\u0000/g, "");

  try {
    return JSON.parse(dataString);
  } catch (error) {
    logger.error(getErrorMessage(error), error);
    return null;
  }
}

const getNamespaceFromEvent = (stateEvent: VeadotubeStateEventResponse): VeadotubeNamespace => `${stateEvent.name}:${stateEvent.payload.event}`;