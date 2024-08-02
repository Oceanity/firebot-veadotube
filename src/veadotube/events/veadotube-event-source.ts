import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager"
import {
  VEADOTUBE_EVENT_SOURCE_ID,
  VEADOTUBE_SCRIPT_NAME
} from "../constants";

export const VeadotubeEventSource: EventSource = {
  id: VEADOTUBE_EVENT_SOURCE_ID,
  name: VEADOTUBE_SCRIPT_NAME,
  events: [
    {
      id: "state-changed",
      name: "Veadotube State Changed",
      description: "The active state in Veadotube was changed",
      manualMetadata: {
        veadotubeState: "Test State"
      }
    }
  ]
}