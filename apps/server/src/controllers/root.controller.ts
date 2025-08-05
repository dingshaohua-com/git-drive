import redis from '@/utils/redis-helper';
import { queryOne } from '@/service/user';
import reqCtx from '@/middleware/req-ctx';
import { user as User } from '@prisma/client';
import { login, sendCode } from '@/service/root';
import JsonResult, { ApiResponse } from '../utils/json-result';
import { Controller, Get, Post, Body, Route, Header, Tags } from 'tsoa';
import swaggerJson from '../../swagger.json';

type LoginParams = {} & User;

@Route('api')
@Tags('根接口')
export class RootController extends Controller {
  @Get()
  public async hi(): ApiResponse<string> {
    return JsonResult.success('hello, this is server');
  }

  @Get('doc')
  public async doc() {
    return swaggerJson;
  }

   /**
   * 登录
   * @summary 获取所有用户信息
   */
  @Post('login')
  public async login(@Body() requestBody: LoginParams): ApiResponse<{ token: string; me: User }> {
    const token = await login(requestBody);
    const userId = reqCtx.get('userId');
    const me = await queryOne({ id: userId });
    return JsonResult.success({ token, me });
  }

  // 退出登录
  @Post('logout')
  public async logout(@Header('Authorization') authorization: string): ApiResponse {
    const token = authorization.replace('Bearer ', '');
    if (token) {
      // 删除 Redis 中的 token
      await redis.del(`token:${token}`);
    }
    return JsonResult.success();
  }

  // 发送邮箱验证码
  @Post('send-code')
  public async sendCode(@Body() requestBody): ApiResponse {
    await sendCode(requestBody);
    return JsonResult.success();
  }
}
