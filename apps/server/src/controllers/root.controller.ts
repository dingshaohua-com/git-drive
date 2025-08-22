import fs from 'fs';
import path from 'path';
import redis from '@/utils/redis-helper';
import { queryOne } from '@/service/user';
import reqCtx from '@/middleware/req-ctx';
import LoginParams from '../types/login.dto';
import { user as User } from '@prisma/client';
import { login, sendCode } from '@/service/root';
import swaggerJson from '../static/swagger.json';
import JsonResult, { ApiResponse } from '../utils/json-result';
import { Controller, Get, Post, Body, Route, Header, Tags, Hidden, BodyProp } from 'tsoa';
import NormalError from '@/exception/normal-err';

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
   * 支持多种登录方式。
   * 首次登录请用邮箱验证码登录方式，进去之后再设置密码，以后便可以用账密方式登录了！
   *
   * | 登录方式 | 字段 | 说明 |
   * |----------|----------|------|
   * | 账号密码 | username, password | 账密登录 |
   * | 邮箱验证码 | email, code | 邮箱 + 验证码登录 |
   *
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
   * @summary 登出
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
  public async sendCode(@Body() params: { email?: string; phone?: string; type?: string }): ApiResponse {
    // 如果是重置邮箱，则需要校验原邮箱是否已经被注册
    if (params.type === 'resetEmail') {
      const user = await queryOne({ email: params.email });
      if (user) {
        throw new NormalError('该邮箱已被注册，请更换邮箱，或让 Ta 注销！');
      }
    }
    await sendCode(params);
    return JsonResult.success();
  }
}
