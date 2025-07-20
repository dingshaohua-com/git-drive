export interface JsonResultType<T = any> {
  readonly code: number;
  readonly msg: string;
  readonly data?: T;
}

export default class JsonResult {
  static success<T>(data?: T): JsonResultType<T> {
    return {
      code: 0,
      msg: 'SUCCESS',
      ...(data !== undefined ? { data } : {}),
    };
  }

  static failed(msg: string = 'FAILED'): JsonResultType<null> {
    return {
      code: 1,
      msg,
      data: null,
    };
  }
}
