import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { veadotube } from "../../main";
import { logger } from "@oceanity/firebot-helpers/firebot";

export const ChangeVeadotubeStateEffectType: Firebot.EffectType<{
  state: string;
}> = {
    definition: {
      id: "oceanity-veadotube:change-state",
      name: "Change State",
      description: "Changes the active Veadotube State",
      icon: "fad fa-deer",
      categories: ["common"]
    },
    optionsTemplate: `
      <eos-container header="Veadotube States">
        <div>
          <button class="btn btn-link" ng-click="getStates()">Refresh States</button>
        </div>
      </eos-container>
    `,
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.isObsConfigured = false;
    $scope.states = {};

    $scope.getStates = () => {
      console.log("Change State Effect: Getting States");
      console.log($q);
      console.log(backendCommunicator);
      $q.when(
        backendCommunicator.fireEventAsync("oceanity-veadotube-get-states")
      ).then((states: any) => {
        $scope.states = states;
        console.log($scope.states);
      });
    };
    $scope.getStates();
  },
  optionsValidator: (effect) => {
    if (effect.state == null) {
      return ["Please select a state."];
    }
    return [];
  },
  onTriggerEvent: async ({ effect }) => {
    logger.info(JSON.stringify(effect));
    return true;
  }
};
