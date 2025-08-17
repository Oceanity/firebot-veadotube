import { IntegrationDefinition } from "@crowbartools/firebot-custom-scripts-types";
import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import * as packageJson from "../package.json";
import {
  VeadotubeIntegrationEvent,
  VeadotubeIntegrationSettings,
} from "./types";

export const {
  name: VEADOTUBE_INTEGRATION_ID,
  displayName: VEADOTUBE_INTEGRATION_NAME,
  description: VEADOTUBE_INTEGRATION_DESCRIPTION,
  author: VEADOTUBE_INTEGRATION_AUTHOR,
  version: VEADOTUBE_INTEGRATION_VERSION,
} = packageJson;

export const VEADOTUBE_INTEGRATION_FIREBOT_VERSION = "5";
export const VEADOTUBE_INTEGRATION_NAME_WITH_AUTHOR = `${VEADOTUBE_INTEGRATION_NAME} (by ${VEADOTUBE_INTEGRATION_AUTHOR})`;

export const VEADOTUBE_DEFAULT_ADDRESS = "127.0.0.1:65456";
export const VEADOTUBE_DEFAULT_INSTANCE_TYPE = "mini";
export const VEADOTUBE_CONNECTION_NAME = "OceanityFirebotScript";

export const VEADOTUBE_VARIABLE_PREFIX = "veadotube";

export const VEADOTUBE_INTEGRATION_DEFINITION: IntegrationDefinition<VeadotubeIntegrationSettings> =
  {
    id: VEADOTUBE_INTEGRATION_ID,
    name: VEADOTUBE_INTEGRATION_NAME,
    description: VEADOTUBE_INTEGRATION_DESCRIPTION,
    linkType: "none",
    configurable: true,
    connectionToggle: false,
    settingCategories: {
      server: {
        title: "Server Settings",
        settings: {
          address: {
            type: "string",
            default: VEADOTUBE_DEFAULT_ADDRESS,
            title: "Server Address",
          },
          instanceType: {
            type: "string",
            default: VEADOTUBE_DEFAULT_INSTANCE_TYPE,
            title: "Instance Type",
            description:
              "The type of Veadotube instance you are connecting to (mini, live, or editor).",
          },
        },
      },
    },
  };

export const VEADOTUBE_EVENT_SOURCE: EventSource = {
  id: VEADOTUBE_INTEGRATION_ID,
  name: "Veadotube",
  events: [
    {
      id: VeadotubeIntegrationEvent.Connected,
      name: "Veadotube Connected",
      description: "Connected to Veadotube WebSocket Server",
    },
    {
      id: VeadotubeIntegrationEvent.Disconnected,
      name: "Veadotube Disconnected",
      description:
        "Disconnected from Veadotube WebSocket Server, either by error or intentional close",
    },
    {
      id: VeadotubeIntegrationEvent.ConnectionError,
      name: "Veadotube Connection Error",
      description:
        "Disconnected from Veadotube WebSocket Server, specifically due to connection error",
    },
    {
      id: VeadotubeIntegrationEvent.StateChanged,
      name: "Veadotube State Changed",
      description: "The active state in Veadotube was changed",
      manualMetadata: {
        veadotubeState: "Test State",
      },
    },
  ],
};

//#region Effect Names

export const VEADOTUBE_STATE_CHANGED_EVENT_ID = "state-changed";

//#endregion
