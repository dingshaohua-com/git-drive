import fs from 'fs';
import path from 'path';
import redis from '@/utils/redis-helper';
import { queryOne } from '@/service/user';
import reqCtx from '@/middleware/req-ctx';
import { user as User } from '@prisma/client';
import LoginParams from '../types/login.dto'
import { login, sendCode } from '@/service/root';
import swaggerJson from '../static/swagger.json';
import JsonResult, { ApiResponse } from '../utils/json-result';
import { Controller, Get, Post, Body, Route, Header, Tags, Hidden } from 'tsoa';



@Route('api')
@Tags('root')
export class RootController extends Controller {
  // @Get()
  // public async hi(): ApiResponse<string> {
  //   return JsonResult.success('hello, this is server');
  // }

  @Hidden()
  @Get()
  public async ui() {
    const filePath = path.resolve('src', 'static', 'scalar.html');
    // 设置响应头
    this.setHeader('Content-Type', 'text/html; charset=utf-8');
    // 同步读取文件
    return fs.readFileSync(filePath);
  }

  @Hidden()
  @Get('doc')
  public async doc() {
    return swaggerJson;
  }

  /**
   * 就是登录接口
   * @summary 登录
   */
  @Post('login')
  public async login(@Body() requestBody: LoginParams): ApiResponse<{ token: string; me: User }> {
    const token = await login(requestBody);
    const userId = reqCtx.get('userId');
    const me = await queryOne({ id: userId });
    return JsonResult.success({ token, me });
  }

  /**
   * 退出登录
   * @summary 退出
   */
  @Post('logout')
  public async logout(@Header('Authorization') authorization: string): ApiResponse {
    const token = authorization.replace('Bearer ', '');
    if (token) {
      // 删除 Redis 中的 token
      await redis.del(`token:${token}`);
    }
    return JsonResult.success();
  }

  /**
   * 发送证码 接口
   * @summary 发送证码
   */
  @Post('send-code')
  public async sendCode(@Body() requestBody): ApiResponse {
    await sendCode(requestBody);
    return JsonResult.success();
  }
}
