import * as WebSocket from 'ws';
import { logger } from "@oceanity/firebot-helpers/firebot";
import { veadotubePayloads } from "./messages";
import { randomUUID } from 'crypto';

interface ResponsePromise {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

export class VeadtoubeService {
  private readonly ws: WebSocket;
  private readonly pendingRequests: Map<string, ResponsePromise>;

  constructor(serverAddress: string) {
    this.ws = new WebSocket(`ws://${serverAddress}?n=OceanityFirebotScript`);
    this.pendingRequests = new Map();

    this.ws.addEventListener('open', (event: WebSocket.Event) => this.onOpen(event));
    this.ws.addEventListener('message', (event: WebSocket.MessageEvent) => this.onMessage(event));
  }

  private async onOpen(event: WebSocket.Event) {
    logger.info("Connected to Veadotube Server");
    logger.info(JSON.stringify(event));
  }

  private async onMessage(event: WebSocket.MessageEvent) {
    logger.info(JSON.stringify(event.data));
    try {
      const data = JSON.parse(event.data.toString());
      const requestId = data.requestId;
      if (this.pendingRequests.has(requestId)) {
        this.pendingRequests.get(requestId)?.resolve(data);
        this.pendingRequests.delete(requestId);
      }
    } catch (error) {
      logger.error("Error parsing message data: " + error);
    }
  }

  private async sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = randomUUID();
      message.requestId = requestId;
      this.pendingRequests.set(requestId, { resolve, reject });

      this.ws.send(JSON.stringify(message));
    });
  }

  public async getStates(): Promise<any> {
    const message = veadotubePayloads.ListStates();
    return this.sendMessage(message);
  }
}
