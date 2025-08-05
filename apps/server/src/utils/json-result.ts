export interface JsonResultType<T = any> {
  readonly code: number;
  readonly msg: string;
  readonly data?: T;
}

/**
 * 控制器方法返回类型的通用别名
 * 用于简化 Promise<JsonResultType<T>> 的写法
 */
export type ApiResponse<T = any> = Promise<JsonResultType<T>>;

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
