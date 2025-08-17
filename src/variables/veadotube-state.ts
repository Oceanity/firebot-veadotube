import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { VEADOTUBE_INTEGRATION_ID } from "../constants";
import { Trigger as TriggerType } from "../veadotube/common";
import { VEADOTUBE_STATE_CHANGED_EVENT_ID } from "../veadotube/constants";
import { currentState } from "../veadotube/veadotube-remote";

const triggers: Record<string, any> = {};
triggers[TriggerType.EVENT] = [
  `${VEADOTUBE_INTEGRATION_ID}:${VEADOTUBE_STATE_CHANGED_EVENT_ID}`,
];
triggers[TriggerType.MANUAL] = true;

export const VeadotubeStateVariable: ReplaceVariable = {
  definition: {
    handle: "veadotubeState",
    description: "Returns the name of the current Veadotube state.",
    possibleDataOutput: ["text"],
  },
  evaluator: async (trigger: any) => {
    return (
      trigger.metadata?.eventData?.veadotubeState ??
      currentState?.name ??
      "Unknown State"
    );
  },
};
