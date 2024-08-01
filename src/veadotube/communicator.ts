import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { getStates } from "./veadotube-remote";

export function setupFrontendListeners(
  frontendCommunicator: ScriptModules["frontendCommunicator"]
) {
  frontendCommunicator.onAsync<never, any>(
    "oceanity-veadotube-get-states",
    getStates
  );
}