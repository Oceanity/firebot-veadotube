
type VeadotubeState = {
  id: string
  name: string
}

type VeadotubeStateListResponse = {
  nodes: {
    "event": "payload",
    "type": "stateEvents",
    "id": "mini",
    "name": "avatar state",
    "payload": {
      "event": "list",
      "states": VeadotubeState[]
    }
  }
}