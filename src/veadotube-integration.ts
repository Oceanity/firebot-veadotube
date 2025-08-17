import {
  IntegrationController,
  IntegrationData,
  IntegrationEvents,
} from "@crowbartools/firebot-custom-scripts-types";
import { eventManager, logger } from "@oceanity/firebot-helpers/firebot";
import { TypedEmitter } from "tiny-typed-emitter";
import { VEADOTUBE_INTEGRATION_ID } from "./constants";
import {
  VeadotubeIntegrationEvent,
  VeadotubeIntegrationSettings,
} from "./types";
import { VeadotubeClient } from "./veadotube-client";

class IntegrationEventEmitter extends TypedEmitter<IntegrationEvents> {}

class VeadotubeIntegration
  extends IntegrationEventEmitter
  implements IntegrationController<VeadotubeIntegrationSettings>
{
  public client?: VeadotubeClient;

  connected = false;

  constructor() {
    super();
  }

  init(
    _linked: boolean,
    integrationData: IntegrationData<VeadotubeIntegrationSettings>
  ): void | PromiseLike<void> {
    this.initVeadotubeIntegration(integrationData.userSettings);
  }

  onUserSettingsUpdate?(
    integrationData: IntegrationData<VeadotubeIntegrationSettings>
  ): void | PromiseLike<void> {
    logger.info("Veadotube Integration settings updated");

    this.initVeadotubeIntegration(integrationData.userSettings);
  }

  private async initVeadotubeIntegration(
    settings?: VeadotubeIntegrationSettings
  ) {
    logger.info("Initializing Veadotube Integration...");

    if (this.client && this.client.connected) {
      this.client.disconnect();
      this.client = undefined;
    }

    this.client = new VeadotubeClient(settings);

    this.client.on(VeadotubeIntegrationEvent.Connected, () => {
      this.triggerFirebotEvent(VeadotubeIntegrationEvent.Connected);

      logger.info("Connected to Veadotube WebSocket Server");
    });

    this.client.on(VeadotubeIntegrationEvent.Disconnected, () => {
      this.triggerFirebotEvent(VeadotubeIntegrationEvent.Disconnected);

      logger.info("Disconnected from Veadotube WebSocket Server");
    });

    this.client.on(VeadotubeIntegrationEvent.ConnectionError, (error) => {
      this.triggerFirebotEvent(VeadotubeIntegrationEvent.ConnectionError);

      logger.error("Error connecting to Veadotube WebSocket Server", error);
    });

    this.client.connect();
  }

  private triggerFirebotEvent(
    event: VeadotubeIntegrationEvent,
    meta?: Record<string, unknown>
  ) {
    eventManager.triggerEvent(VEADOTUBE_INTEGRATION_ID, event, meta ?? {});
  }
}

export let veadotubeIntegration: VeadotubeIntegration | undefined;

export function initVeadotubeIntegration(): VeadotubeIntegration {
  veadotubeIntegration = new VeadotubeIntegration();

  return veadotubeIntegration;
}
