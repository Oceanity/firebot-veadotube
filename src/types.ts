//#region Enums

export enum VeadotubeInstanceType {
  Mini = "mini",
  Live = "live",
  Editor = "editor",
}

export enum VeadotubeEvent {
  List = "list",
  Listen = "listen",
  Payload = "payload",
  Peek = "peek",
  Pop = "pop",
  Push = "push",
  Set = "set",
  Thumb = "thumb",
  Unlisten = "unlisten",
}

export enum VeadotubeEventsType {
  State = "stateEvents",
}

export enum VeadotubeEventName {
  AvatarState = "avatar state",
}

export enum VeadotubeIntegrationEvent {
  Connected = "connected",
  ConnectionError = "connectionError",
  Disconnected = "disconnected",
  StateChanged = "state-changed",
}

//#endregion

//#region Types

export type VeadotubeIntegrationSettings = {
  server: {
    address: string;
    instanceType:
      | VeadotubeInstanceType.Mini
      | VeadotubeInstanceType.Live
      | VeadotubeInstanceType.Editor;
  };
};

export type VeadotubePayload =
  | {
      event: VeadotubeEvent.List | VeadotubeEvent.Peek;
    }
  | {
      event: VeadotubeEvent.Listen | VeadotubeEvent.Unlisten;
      token: string;
    }
  | {
      event:
        | VeadotubeEvent.Pop
        | VeadotubeEvent.Push
        | VeadotubeEvent.Set
        | VeadotubeEvent.Thumb;
      state: string;
    };

export type VeadotubeEventPayload = {
  event: VeadotubeEvent.Payload;
  type: VeadotubeEventsType;
  id: string;
  payload: VeadotubePayload;
};

export type VeadotubeEventResponse = {
  event: VeadotubeEvent.Payload;
  type: VeadotubeEventsType;
  id: VeadotubeInstanceType;
} & {
  name: VeadotubeEventName.AvatarState;
  payload: VeadotubeStatePeekPayload;
};

export type VeadotubeStatePeekPayload = {
  event: VeadotubeEvent.Peek;
  state: string;
};

//#endregion
