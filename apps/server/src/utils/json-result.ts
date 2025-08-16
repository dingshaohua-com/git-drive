export interface JsonResultType<T = any> {
  readonly code: number;
  readonly msg: string;
  readonly data: T;
}

/**
 * 控制器方法返回类型的通用别名
 * 用于简化 Promise<JsonResultType<T>> 的写法
 */
export type ApiResponse<T = any> = Promise<JsonResultType<T>>;

export default class JsonResult {
  /**
   * 成功响应
   * @param data 成功时返回的数据
   * @param msg 成功消息，默认为 'SUCCESS'
   */
  static success<T>(data: T = null, msg: string = 'SUCCESS'): JsonResultType<T> {
    return {
      code: 0,
      msg,
      data,
    };
  }

  /**
   * 失败响应
   * @param msg 失败消息，默认为 'FAILED'
   */
  static failed<T>(msg: string = 'FAILED', data: T = null): JsonResultType<T> {
    return {
      code: 1,
      msg,
      data,
    };
  }
}
