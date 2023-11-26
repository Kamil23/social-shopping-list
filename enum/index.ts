export enum APIUrl {
  GetSession = '/api/session/get',
  CreateSession = '/api/session/create',
  UpdateSession = '/api/session/update',
  UpdateSessionName = '/api/session/updateName',
  CreateItem = '/api/item/create',
  UpdateItem = '/api/item/update',
  DeleteItem = '/api/item/delete',
}

export enum WebsocketMessageType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  TOGGLE_CHECK = 'check',
  POSITION_CHANGE = 'position',
  CONNECTION_COUNT = 'connectionCount',
  CLIENT_CONNECTED = 'clientConnected',
  START_TYPING = 'startTyping',
  STOP_TYPING = 'stopTyping',
}