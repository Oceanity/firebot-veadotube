import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { getStateByName, setState, setToRandomState } from "../veadotube-remote";

export const ChangeVeadotubeStateEffectType: Firebot.EffectType<{
  changeMode: string;
  stateId?: string;
  stateName?: string;
}> = {
    definition: {
      id: "oceanity-veadotube:change-state",
      name: "Veadotube: Change State",
      description: "Changes the active Veadotube State",
      icon: "fad fa-deer",
      categories: ["common"]
    },
    optionsTemplate: `
      <eos-container header="Change Mode" pad-top="true">
        <dropdown-select
          options="changeModes"
          selected="effect.changeMode"
        ></dropdown-select>
      </eos-container>
      <eos-container header="New State" pad-top="true" ng-if="effect.changeMode != 'random'">
        <div ng-if="effect.changeMode == 'list'">
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
        </div>
        <div ng-if="effect.changeMode == 'name'">
          <firebot-input
            input-title="State Name"
            placeholder-text="Name of the state to change to"
            model="effect.stateName"
          />
        </div>
      </eos-container>
    `,
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.changeModes = Object.freeze({
      list: "Pick From List",
      name: "By Name/Variable",
      random: "Random State"
    });
    $scope.isObsConfigured = false;
    $scope.states = [];

    if ($scope.effect.changeMode == null) {
      $scope.effect.changeMode = "list";
    }

    $scope.selectState = (stateId: string) => {
      $scope.effect.stateId = stateId;
    };

    $scope.getStates = () => {
      $q.when(
        backendCommunicator.fireEventAsync("oceanity-veadotube-get-states")
      ).then((states: VeadotubeState[]) => {
        $scope.states = states;
        $scope.selected = states.find((state: VeadotubeState) => state.id === $scope.effect.stateId);;
      });
    };
    $scope.getStates();
  },
  optionsValidator: (effect) => {
    if (effect.changeMode == "list" && effect.stateId == null) {
      return ["Please select a state."];
    }
    if (effect.changeMode == "name" && effect.stateName == null) {
      return ["Please enter a state name."];
    }
    return [];
  },
  onTriggerEvent: async ({ effect }) => {
    switch (effect.changeMode) {
      case "list":
        if (!effect.stateId) throw "State ID Required";
        await setState(effect.stateId);
        return true;
      case "name":
        if (!effect.stateName) throw "State Name Required";
        const state = await getStateByName(effect.stateName);
        if (state) {
          await setState(state.id);
        }
        return true;
      case "random":
        await setToRandomState();
        return true;
    }
    
    throw "Invalid mode";
  }
}

