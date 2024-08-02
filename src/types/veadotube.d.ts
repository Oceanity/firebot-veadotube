type VeadotubeStateId = `${number}`;

type VeadotubeState = {
  id: VeadotubeStateId
  name: string
}

type VeadotubeStateEventResponse = {
  event: "payload",
  type: "stateEvents",
  id: "mini",
  name: VeadotubeName,
  payload: {
    event: VeadotubeEvent
  } & Record<string, any>
}

type VeadotubeStateListResponse = VeadotubeStateEventResponse & {
  name: "avatar state",
  payload: {
    event: "list",
    states: VeadotubeState[]
  }
}

type VeadotubeAvatarStatePeekResponse = VeadotubeStateEventResponse & {
  name: "avatar state",
  payload: {
    event: "peek",
    state: VeadotubeStateId
  }
}

type VeadotubeInstanceType =
  | "mini"
  | "live"
  | "editor";

type VeadotubeName =
  | "avatar state"

type VeadotubeEvent =
  | "list"
  | "payload"
  | "peek"
  | "listen"
  | "unlisten"
  | "set"
  | "push"
  | "pop"
  | "thumb";

type VeadotubeNamespace = `${VeadotubeName}:${VeadotubeEvent}`;