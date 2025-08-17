import { logger } from "@oceanity/firebot-helpers/firebot";
import * as WebSocket from "ws";

export function parseWebSocketData<T>(data: WebSocket.Data): T | null {
  const dataString = data
    .toString()
    .replace(/.*nodes:/, "")
    .replace(/\u0000/g, "");

  try {
    return JSON.parse(dataString) as T;
  } catch (error) {
    logger.error("Failed to parse WebSocket data", error);
    return null;
  }
}
