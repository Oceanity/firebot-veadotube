export const stateEventPayload = (input: Record<string, string>) => Object.freeze({
    event: "payload",
    type: "stateEvents",
    id: "mini",
    payload: input
  });

export const veadotubePayloads = Object.freeze({
  GetInitialList: () => ({ event: "list"}),
  ListStates: () => stateEventPayload({ event: "list"}),
  PeekState: () => stateEventPayload({ event: "peek"}),
  Listen: (token: string) => stateEventPayload({ event: "listen", token: token }),
  Unlisten: (token: string) => stateEventPayload({ event: "unlisten", token: token }),
  SetState: (stateId: string) => stateEventPayload({ event: "set", state: stateId }),
  PushState: (stateId: string) => stateEventPayload({ event: "push", state: stateId }),
  PopState: (stateId: string) => stateEventPayload({ event: "pop", state: stateId }),
  CallStateThumb: (stateId: string) => stateEventPayload({ event: "thumb", state: stateId }),
});