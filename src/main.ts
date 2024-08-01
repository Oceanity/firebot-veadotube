import { initModules } from "@oceanity/firebot-helpers/firebot";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import * as packageJson from "../package.json";
import { VeadtoubeService } from "./veadotube";
import { AllVeadotubeEffects } from "./veadotube/effects";
import { setupFrontendListeners } from "./veadotube/communicator";
import { initRemote } from "./veadotube/veadotube-remote";

export const { displayName: name, description, version, author } = packageJson;

export let veadotube: VeadtoubeService;

interface Params {
  veadotubeServer: string;
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
    };
  },
  run: (runRequest) => {
    const { modules, parameters } = runRequest;

    if (!parameters.veadotubeServer) {
      throw new Error("Veadotube Server Address not set");
    }

    initModules(modules);
    // veadotube = new VeadtoubeService(runRequest.parameters.veadotubeServer);
    initRemote(runRequest.parameters.veadotubeServer);

    // Register Communicator
    setupFrontendListeners(runRequest.modules.frontendCommunicator);

    // Register Effects
    for (const effect of AllVeadotubeEffects) {
      runRequest.modules.effectManager.registerEffect(effect);
    }
  },
};

export default script;
