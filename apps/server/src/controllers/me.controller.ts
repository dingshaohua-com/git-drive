import reqCtx from '@/middleware/req-ctx';
import { queryOne, update, resetEmail } from '@/service/user';
import { user as User, Prisma } from '@prisma/client';
import JsonResult, { ApiResponse } from '../utils/json-result';
import { Controller, Get, Post, Body, Route, Header, Tags, Hidden, Put } from 'tsoa';

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
}
