export enum APIUrl {
  GetSession = '/api/session/get',
  CreateSession = '/api/session/create',
  UpdateSession = '/api/session/update',
  CreateItem = '/api/item/create',
  UpdateItem = '/api/item/update',
  DeleteItem = '/api/item/delete',
};

export enum TimeInMilliseconds {
  OneSecond = 1000,
  OneMinute = 60 * 1000,
  OneHour = 60 * 60 * 1000,
  OneDay = 24 * 60 * 60 * 1000,
}