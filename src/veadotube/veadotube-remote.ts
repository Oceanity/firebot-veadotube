import { logger } from "@oceanity/firebot-helpers/firebot";
import * as WebSocket from "ws";
import { veadotubePayloads } from "./messages";
import { getErrorMessage } from "@oceanity/firebot-helpers/string";
import { v4 as uuidv4 } from "uuid";

const RECONNECT_INTERVAL = 5000;

let connected = false;
let ws: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;

// Map to track pending requests
const pendingRequests = new Map<string, { resolve: Function, reject: Function }>();

async function maintainConnection(serverAddress: string) {
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
        const dataString = data.toString()
          .replace(/.*nodes:/, "")
          .replace(/\u0000/g, "");

        let response;

        try {
          response = JSON.parse(dataString);
        } catch (error) {
          logger.error(getErrorMessage(error), error);
          return;
        }

        const requestId = response.id;
        if (pendingRequests.has(requestId)) {
          const { resolve } = pendingRequests.get(requestId)!;
          resolve(response);
          pendingRequests.delete(requestId);
        }
      });
    } catch (error) {
      logger.error("Unexpected error in maintainConnection", error);
    }
  }
}

export function initRemote(serverAddress: string) {
  maintainConnection(serverAddress);
}

function call<T>(method: keyof typeof veadotubePayloads, token?: string): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!connected || !ws) {
      resolve([] as unknown as T);
      return;
    }

    const requestId = uuidv4();
    pendingRequests.set(requestId, { resolve, reject });

    ws.once("error", (error) => {
      logger.error("Error making call to Veadotube Server", method, token, error);
      pendingRequests.delete(requestId);
      reject(error);
    });

    const payload = JSON.stringify({ ...veadotubePayloads[method](token as string), id: requestId });
    ws.send(payload);
  });
}

export async function getStates() {
  console.log("Getting states");
  try {
    const states = await call<VeadotubeStateListResponse>("ListStates");
    console.log(states);
  } catch (error) {
    console.log(error);
  }
}
