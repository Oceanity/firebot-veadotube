import { VEADOTUBE_DEFAULT_INSTANCE_TYPE } from "../constants";
import {
  VeadotubeEvent,
  VeadotubeEventPayload,
  VeadotubeEventsType,
  VeadotubePayload,
} from "../types";
import { veadotubeIntegration } from "../veadotube-integration";

export const stateEventPayload = (
  input: VeadotubePayload
): Readonly<VeadotubeEventPayload> =>
  Object.freeze({
    event: VeadotubeEvent.Payload,
    type: VeadotubeEventsType.State,
    id:
      veadotubeIntegration?.client?.instanceType ??
      VEADOTUBE_DEFAULT_INSTANCE_TYPE,
    payload: input,
  });

export const veadotubePayloads = Object.freeze({
  list: () => ({ event: VeadotubeEvent.List }),
  state: {
    list: () => stateEventPayload({ event: VeadotubeEvent.List }),
    peek: () => stateEventPayload({ event: VeadotubeEvent.Peek }),
    listen: (token: string) =>
      stateEventPayload({ event: VeadotubeEvent.Listen, token: token }),
    unlisten: (token: string) =>
      stateEventPayload({ event: VeadotubeEvent.Unlisten, token: token }),
    set: (stateId: string) =>
      stateEventPayload({ event: VeadotubeEvent.Set, state: stateId }),
    push: (stateId: string) =>
      stateEventPayload({ event: VeadotubeEvent.Push, state: stateId }),
    pop: (stateId: string) =>
      stateEventPayload({ event: VeadotubeEvent.Pop, state: stateId }),
    thumb: (stateId: string) =>
      stateEventPayload({ event: VeadotubeEvent.Thumb, state: stateId }),
  },
});
