import { initModules } from "@oceanity/firebot-helpers/firebot";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import * as packageJson from "../package.json";
import { VeadtoubeService } from "./veadotube";
import { AllVeadotubeEffects } from "./veadotube/effects";
import { setupFrontendListeners } from "./veadotube/communicator";
import { initRemote } from "./veadotube/veadotube-remote";
import { VeadotubeEventSource } from "./veadotube/events/veadotube-event-source";

export const { displayName: name, description, version, author } = packageJson;

export let veadotube: VeadtoubeService;

interface Params {
  veadotubeServer: string;
  veadotubeInstanceType: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name,
      description,
      author,
      version,
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      veadotubeServer: {
        type: "string",
        default: "127.0.0.1:<port>",
        description: "Veadotube Server Address",
        secondaryDescription: "Enter your server IP address and port, be sure to set it in manually in `program settings` in Veadotube or the port will change every time you restart Veadotub",
      },
      veadotubeInstanceType: {
        type: "string",
        default: "mini",
        description: "Veadotube Instance Type",
        secondaryDescription: "Input `mini` for Veadotube Mini, `live` for Veadotube Live, or `editor` for Veadotube Editor",
      }
    };
  },
  run: (runRequest) => {
    const { modules, parameters } = runRequest;

    if (!parameters.veadotubeServer) {
      throw new Error("Veadotube Server Address not set");
    }

    if (!parameters.veadotubeInstanceType) {
      throw new Error("Veadotube Instance Type not set");
    }

    if (["mini", "live", "editor"].indexOf(parameters.veadotubeInstanceType) === -1) {
      throw new Error("Veadotube Instance Type not valid");
    }

    initModules(modules);
    initRemote(parameters.veadotubeServer, parameters.veadotubeInstanceType as VeadotubeInstanceType);

    // Register Communicator
    setupFrontendListeners(modules.frontendCommunicator);

    // Register Effects
    for (const effect of AllVeadotubeEffects) {
      modules.effectManager.registerEffect(effect);
    }

    // Register Events
    modules.eventManager.registerEventSource(VeadotubeEventSource);
  },
};

export default script;
