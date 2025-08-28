import fs from 'fs';
import path from 'path';
import redis from '@/utils/redis-helper';
import { queryOne } from '@/service/user';
import reqCtx from '@/middleware/req-ctx';
import LoginParams from '../types/login.dto';
import { login, resetPwd, sendCode } from '@/service/root';
import swaggerJson from '../static/swagger.json';
import NormalError from '@/exception/normal-err';
import { decryptAll } from '@dingshaohua.com/hybrid-crypto';
import JsonResult, { ApiResponse } from '../utils/json-result';
import { user as User, sys_conf as SysConf } from '@prisma/client';
import { Controller, Get, Post, Body, Route, Header, Tags, Hidden, BodyProp } from 'tsoa';

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
    const result = await login(requestBody);
    return JsonResult.success(result);
  }

  /**
   * 退出登录
   * @summary 登出
   */
  @Post('logout')
  public async logout(@Header('authorization') author: string): ApiResponse {
    const token = author.replace('Bearer ', '');
    console.log(777888, token);

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

  /**
   * 发送重置密码链接 接口
   * @summary 发送重置密码链接
   */
  @Post('send-reset-pwd-link')
  public async sendResetPwdLink(@Body() params: { email: string }): ApiResponse {
    // 如果是重置邮箱，则需要校验原邮箱是否已经被注册
    await sendCode({...params, type: 'resetPwd'});
    return JsonResult.success();
  }


   /**
   * @summary 重置密码
   */
  @Post('reset-pwd')
  public async resetPwd(@Body() params: { password: string; aseKeyEncrypt: string, email: string, code:string }): ApiResponse {
    const result = await resetPwd(params);
     return JsonResult.success(result);
   
  }

}
