import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager"
import { name as id } from "../../main"

export const VeadotubeEventSource: EventSource = {
  id,
  name: "Veadotube",
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