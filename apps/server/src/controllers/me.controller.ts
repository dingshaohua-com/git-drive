import reqCtx from '@/middleware/req-ctx';
import { user as User, Prisma } from '@prisma/client';
import { toHash } from '@/utils/crypto-helper/hash-handler';
import { queryOne, update, resetEmail } from '@/service/user';
import JsonResult, { ApiResponse } from '../utils/json-result';
import { toSymmetric } from '@/utils/crypto-helper/gen-crypto';
import { Controller, Get, Post, Body, Route, Header, Tags, Hidden, Put } from 'tsoa';
import { decryptByAsymmetric, decryptBySymmetric } from '@/utils/crypto-helper/decrypt-encrypt';

@Route('api/me')
@Tags('me')
export class MeController extends Controller {
  /**
   * @summary 获取
   */
  @Get()
  public async get(): ApiResponse<User> {
    const userId = reqCtx.get('userId');
    const user = await queryOne({ id: userId });
    return JsonResult.success(user);
  }

  /**
   * @summary 更新
   */
  @Put()
  public async update(@Body() user: Prisma.userUpdateInput): ApiResponse<User> {
    const userId = reqCtx.get('userId');
    const results = await update(user, userId);
    return JsonResult.success(results);
  }

  /**
   * @summary 重置邮箱
   */
  @Post('reset-email')
  public async resetEmail(@Body() params: { email: string; code: string }): ApiResponse {
    const results = await resetEmail(params);
    return JsonResult.success(results);
  }

  /**
   * @summary 重置密码
   */
  @Post('reset-pwd')
  public async resetPwd(@Body() params: { newPwd: string; aseKeyEncrypt: string }): ApiResponse {
    const user = reqCtx.get<User>('user');

    console.log(params.newPwd);
    console.log(params.aseKeyEncrypt);
    const aseKeyStr = decryptByAsymmetric(params.aseKeyEncrypt);
    console.log('解密后的密钥字符串:', aseKeyStr);
    console.log('密钥字符串长度:', aseKeyStr.length);

    const aseKey = toSymmetric(aseKeyStr);
    console.log('生成的KeyObject:', aseKey);
    console.log('KeyObject导出的Buffer长度:', aseKey.export().length);

    const newPwd = decryptBySymmetric(params.newPwd, aseKey);

    let result;
    if (user.salt) {
      const { hash } = toHash(newPwd, user.salt);
      result = await update({ password: hash }, user.id);
    } else {
      const { hash, salt } = toHash(newPwd);
      result = await update({ salt, password: hash }, user.id);
    }
    return JsonResult.success(result);
  }
}
