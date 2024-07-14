/*
 *@description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 400,
  TIMEOUT = 401,
  TYPE = 'success'
}
/*
 *@description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}
