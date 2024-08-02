import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { setState } from "../veadotube-remote";

export const ChangeVeadotubeStateEffectType: Firebot.EffectType<{
  stateId: string;
}> = {
    definition: {
      id: "oceanity-veadotube:change-state",
      name: "Veadotube: Change State",
      description: "Changes the active Veadotube State",
      icon: "fad fa-deer",
      categories: ["common"]
    },
    optionsTemplate: `
      <eos-container header="Veadotube States">
        <div>
          <button class="btn btn-link" ng-click="getStates()">Refresh States</button>
        </div>
        <ui-select ng-if="states != null" ng-model="selected" on-select="selectState($select.selected.id)">
          <ui-select-match placeholder="Select a Veadotube State...">{{$select.selected.name}}</ui-select-match>
          <ui-select-choices repeat="state in states | filter: {name: $select.search}">
            <div ng-bind-html="state.name | highlight: $select.search"></div>
          </ui-select-choices>
          <ui-select-no-choice> 
            <b>No Veadotube states found.</b>
          </ui-select-no-choice>
        </ui-select>
      </eos-container>
    `,
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.isObsConfigured = false;
    $scope.states = [];

    $scope.selectState = (stateId: string) => {
      $scope.effect.stateId = stateId;
    };

    $scope.getStates = () => {
      $q.when(
        backendCommunicator.fireEventAsync("oceanity-veadotube-get-states")
      ).then((states: VeadotubeState[]) => {
        $scope.states = states;
        $scope.selected = $scope.states?.find((state: VeadotubeState) => state.name === $scope.effect.stateName);
      });
    };
    $scope.getStates();
  },
  optionsValidator: (effect) => {
    if (effect.stateId == null) {
      return ["Please select a state."];
    }
    return [];
  },
  onTriggerEvent: async ({ effect }) => {
    await setState(effect.stateId);
    return true;
  }
};
