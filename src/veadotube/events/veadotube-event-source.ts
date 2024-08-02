import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager"

export const VeadotubeEventSource: EventSource = {
  id: "oceanity-veadotube",
  name: "Veadotube by Oceanity",
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