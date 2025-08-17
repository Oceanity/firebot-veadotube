import { NotificationType } from "@crowbartools/firebot-custom-scripts-types/types/modules/notification-manager";
import { logger, notificationManager } from "@oceanity/firebot-helpers/firebot";
import { randomUUID as uuidV4 } from "crypto";
import { EventEmitter } from "stream";
import * as WebSocket from "ws";
import {
  VEADOTUBE_CONNECTION_NAME,
  VEADOTUBE_DEFAULT_ADDRESS,
  VEADOTUBE_DEFAULT_INSTANCE_TYPE,
} from "./constants";
import {
  VeadotubeEvent,
  VeadotubeEventName,
  VeadotubeEventPayload,
  VeadotubeEventResponse,
  VeadotubeEventsType,
  VeadotubeIntegrationEvent,
  VeadotubeIntegrationSettings,
  VeadotubePayload,
} from "./types";
import { parseWebSocketData } from "./utils";
import { veadotubePayloads } from "./veadotube/payloads";
// import { veadotubePayloads } from "./veadotube/messages";

// import { instanceType as id } from "./veadotube-remote";

// export const stateEventPayload = (input: Record<string, string>) =>
//   Object.freeze({
//     event: "payload",
//     type: "stateEvents",
//     id,
//     payload: input,
//   });

// export const veadotubePayloads = Object.freeze({
//   GetInitialList: () => ({ event: "list" }),
//   ListStates: () => stateEventPayload({ event: "list" }),
//   PeekState: () => stateEventPayload({ event: "peek" }),
//   Listen: (token: string) =>
//     stateEventPayload({ event: "listen", token: token }),
//   Unlisten: (token: string) =>
//     stateEventPayload({ event: "unlisten", token: token }),
//   SetState: (stateId: string) =>
//     stateEventPayload({ event: "set", state: stateId }),
//   PushState: (stateId: string) =>
//     stateEventPayload({ event: "push", state: stateId }),
//   PopState: (stateId: string) =>
//     stateEventPayload({ event: "pop", state: stateId }),
//   CallStateThumb: (stateId: string) =>
//     stateEventPayload({ event: "thumb", state: stateId }),
// });

// export const stringifyPayload = (payload: any) =>
//   `nodes:${JSON.stringify(payload)}`;

export class VeadotubeClient extends EventEmitter {
  public connected: boolean;
  public stateId: string;
  public instanceType: string;
  public url: string;

  private _ws?: WebSocket;

  constructor(settings?: VeadotubeIntegrationSettings) {
    super();
    this.stateId = uuidV4();
    this.connected = false;
    this.instanceType =
      settings?.server.instanceType || VEADOTUBE_DEFAULT_INSTANCE_TYPE;
    this.url = `ws://${
      settings?.server.address ?? VEADOTUBE_DEFAULT_ADDRESS
    }?n=${VEADOTUBE_CONNECTION_NAME}`;
  }

  connect() {
    if (this._ws) {
      this._ws.removeAllListeners();
      this._ws.close();
      this._ws = undefined;
    }

    try {
      logger.info(`Connecting to Veadotube at ${this.url}`);

      this._ws = new WebSocket(this.url);

      this._ws.on("open", () => {
        this.emit(VeadotubeIntegrationEvent.Connected);

        this.connected = true;

        this.sendMessage(veadotubePayloads.state.listen(this.stateId));
      });

      this._ws.on("close", () => {
        this.emit(VeadotubeIntegrationEvent.Disconnected);

        this.connected = false;
      });

      this._ws.on("message", (data: WebSocket.Data) => {
        try {
          const message = parseWebSocketData<VeadotubeEventResponse>(data);

          if (!message) {
            throw new Error("Error parsing Veadotube message");
          }

          switch (message.name) {
            case VeadotubeEventName.AvatarState:
              logger.info(
                `Veadotube State changed to state with Id: ${message.payload.state}`
              );
              break;
            default:
              logger.info(JSON.stringify(message));
              break;
          }

          // const message = parseResponseData(data);
          // if (!message) return;

          // const namespace = getNamespaceFromEvent(message);

          // switch (namespace) {
          //   case "avatar state:peek":
          //     triggerChangeStateEvent(message.payload.state);
          //     break;
          // }
        } catch (error) {
          logger.error("Failed to handle Veadotube Websocket message", error);
        }
      });

      this._ws.on("error", (error) => {
        this.emit(VeadotubeIntegrationEvent.Disconnected);
        this.emit(VeadotubeIntegrationEvent.ConnectionError, error);

        notificationManager.addNotification(
          {
            title: "Veadotube Error",
            message: `Error connecting to Veadotube WebSocket Server, details:\n\n${
              error.message ?? error.toString()
            }`,
            type: "alert" as NotificationType,
          },
          false
        );

        this.connected = false;
      });
    } catch (error) {
      logger.error("Error connecting to Veadotube Websocket server", error);
    }
  }

  disconnect() {
    if (this._ws) {
      this._ws.removeAllListeners();
      this._ws.close();
      this._ws = undefined;
    }

    this.removeAllListeners();

    logger.info("Disconnected from Veadotube Websocket server");
  }

  public sendMessage(payload: VeadotubePayload | VeadotubeEventPayload) {
    try {
      if (!this._ws) {
        throw new Error("WebSocket client not initialized");
      }

      if (!this.connected) {
        throw new Error(
          "Not currently connected to Veadotube Websocket server"
        );
      }

      this._ws.send(this._stringifyPayload(payload));
    } catch (error) {
      logger.error("Cannot send message to Veadotube server", error);
    }
  }

  public sendEventMessage(payload: VeadotubePayload) {
    this.sendMessage({
      event: VeadotubeEvent.Payload,
      type: VeadotubeEventsType.State,
      id: this.stateId,
      payload,
    });
  }

  private _stringifyPayload = (
    payload: VeadotubePayload | VeadotubeEventPayload
  ) => `nodes:${JSON.stringify(payload)}`;
}
