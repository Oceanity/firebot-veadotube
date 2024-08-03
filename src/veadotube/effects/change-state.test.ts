import { jest } from "@jest/globals";
import { ChangeVeadotubeStateEffectType as changeState } from "./change-state";

describe("Veadotube: Change State", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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