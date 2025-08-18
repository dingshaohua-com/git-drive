import reqCtx from '@/middleware/req-ctx';
import { queryOne, update } from '@/service/user';
import { user as User, Prisma } from '@prisma/client';
import JsonResult, { ApiResponse } from '../utils/json-result';
import { Controller, Get, Post, Body, Route, Header, Tags, Hidden, Put, Query } from 'tsoa';

@Route('api/user')
@Tags('user')
export class UserController extends Controller {
  /**
   * @summary 获取
   */
  @Get()
  public async get(@Query() userId: string): ApiResponse<User> {
    const user = await queryOne({ id: Number(userId) });
    return JsonResult.success(user);
  }

  // /**
  //  * @summary 更新
  //  */
  // @Put()
  // public async update(@Body() user: Prisma.userUpdateInput): ApiResponse<User> {
  //   const userId = reqCtx.get('userId');
  //   const results = await update(user, userId);
  //   return JsonResult.success(results);
  // }
}
