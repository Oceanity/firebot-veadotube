import {
  Firebot,
  Integration,
} from "@crowbartools/firebot-custom-scripts-types";
import { NotificationType } from "@crowbartools/firebot-custom-scripts-types/types/modules/notification-manager";
import {
  initModules,
  integrationManager,
  notificationManager,
} from "@oceanity/firebot-helpers/firebot";
import { checkRemoteVersion } from "@oceanity/firebot-helpers/package";
import * as packageJson from "../package.json";
import {
  VEADOTUBE_EVENT_SOURCE,
  VEADOTUBE_INTEGRATION_AUTHOR,
  VEADOTUBE_INTEGRATION_DEFINITION,
  VEADOTUBE_INTEGRATION_DESCRIPTION,
  VEADOTUBE_INTEGRATION_FIREBOT_VERSION,
  VEADOTUBE_INTEGRATION_GITHUB_LATEST_RELEASE_URL,
  VEADOTUBE_INTEGRATION_GITHUB_PACKAGE_URL,
  VEADOTUBE_INTEGRATION_NAME_WITH_AUTHOR,
  VEADOTUBE_INTEGRATION_VERSION,
} from "./constants";
import { AllVeadotubeEffects } from "./effects";
import { VeadotubeIntegrationSettings } from "./types";
import { AllVeadotubeVariables } from "./variables";
import { VeadotubeService } from "./veadotube";
import { initVeadotubeIntegration } from "./veadotube-integration";
import { setupFrontendListeners } from "./veadotube/communicator";

export const { displayName: name, description, version, author } = packageJson;

export let veadotube: VeadotubeService;

const script: Firebot.CustomScript = {
  getScriptManifest: () => {
    return {
      name: VEADOTUBE_INTEGRATION_NAME_WITH_AUTHOR,
      description: VEADOTUBE_INTEGRATION_DESCRIPTION,
      author: VEADOTUBE_INTEGRATION_AUTHOR,
      version: VEADOTUBE_INTEGRATION_VERSION,
      firebotVersion: VEADOTUBE_INTEGRATION_FIREBOT_VERSION,
    };
  },
  getDefaultParameters: () => ({}),
  run: async (runRequest) => {
    const { modules } = runRequest;

    initModules(modules);

    // check remote version
    const response = await checkRemoteVersion(
      VEADOTUBE_INTEGRATION_VERSION,
      VEADOTUBE_INTEGRATION_GITHUB_PACKAGE_URL
    );

    if (response.isRemoteNewer) {
      notificationManager.addNotification(
        {
          type: "update" as NotificationType,
          title: "Veadotube Integration update available!",
          message: `Oceanity has released an update to the Veadotube Integration (${VEADOTUBE_INTEGRATION_VERSION} -> ${response.version}), go to ${VEADOTUBE_INTEGRATION_GITHUB_LATEST_RELEASE_URL} to download the latest version!`,
        },
        false
      );
    }

    const integration: Integration<VeadotubeIntegrationSettings> = {
      definition: VEADOTUBE_INTEGRATION_DEFINITION,
      integration: initVeadotubeIntegration(),
    };

    integrationManager.registerIntegration(integration);

    // initRemote(
    //   parameters.veadotubeServer,
    //   parameters.veadotubeInstanceType as VeadotubeInstanceType
    // );

    // Register Communicator
    setupFrontendListeners(modules.frontendCommunicator);

    // Register Effects
    for (const effect of AllVeadotubeEffects) {
      modules.effectManager.registerEffect(effect);
    }

    // Register Events
    modules.eventManager.registerEventSource(VEADOTUBE_EVENT_SOURCE);

    // Register Variables
    for (const variable of AllVeadotubeVariables) {
      modules.replaceVariableManager.registerReplaceVariable(variable);
    }
  },
};

export default script;
