import { jest } from "@jest/globals";
import { ChangeVeadotubeStateEffectType as changeState } from "./change-state";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";

describe("Veadotube: Change State", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("optionsValidator", () => {
    it("should return empty array if mode 'list' and stateId is not null", () => {
      if (!changeState.optionsValidator) return;
      const errors = changeState.optionsValidator({ changeMode: "list", stateId: "2145" });
  
      expect(errors).toEqual([]);
    });
  
    it("should return empty array if mode 'list' and stateId is null", () => {
      if (!changeState.optionsValidator) return;
      const errors = changeState.optionsValidator({ changeMode: "name", stateName: "myState" });
  
      expect(errors).toEqual([]);
    });
  
    it("should return empty array if mode 'random'", () => {
      if (!changeState.optionsValidator) return;
      const errors = changeState.optionsValidator({ changeMode: "random" });
  
      expect(errors).toEqual([]);
    })
  
    it("should return error if mode 'list' and stateId is null", () => {
      if (!changeState.optionsValidator) return;
      const errors = changeState.optionsValidator({ changeMode: "list", stateId: undefined });
  
      expect(errors).toEqual(["Please select a state."]);
    });
    
    it("should return error if mode 'name' and stateName is null", () => {
      if (!changeState.optionsValidator) return;
      const errors = changeState.optionsValidator({ changeMode: "name", stateName: undefined });
  
      expect(errors).toEqual(["Please enter a state name."]);
    })
  })

  // describe("onTriggerEvent", () => {
  //   beforeEach(() => {
  //     jest.mock("../veadotube-remote", () => ({
  //       setState: jest.fn(),
  //       getStateByName: jest.fn(),
  //       setToRandomState: jest.fn(),
  //     }));
  //   });

  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it("should return true if mode is valid", () => {
  //     if (!changeState.onTriggerEvent) return;

  //     for (const mode of ["list", "name", "random"]) {
  //       const result = changeState.onTriggerEvent({ effect: { changeMode: mode, stateId: "2145" }, trigger: {} as Effects.Trigger, sendDataToOverlay: () => {} });

  //       expect(result).toEqual(true);
  //     }
  //   });  

  //   it("should throw if mode is invalid", () => {
  //     if (!changeState.onTriggerEvent) return;

  //     expect(() => changeState.onTriggerEvent({ effect: { changeMode: "invalid", stateId: "2145" }, trigger: {} as Effects.Trigger, sendDataToOverlay: () => {} })).toThrow();
  //   });
  // })
})