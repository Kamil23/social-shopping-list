export enum APIUrl {
  GetSession = '/api/session/get',
  CreateSession = '/api/session/create',
  UpdateSession = '/api/session/update',
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
}