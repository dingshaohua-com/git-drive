import { login } from '@/service/root';
import { queryOne } from '@/service/user';
import reqCtx from '@/middleware/req-ctx';
import { Controller, Get, Body, Route } from 'tsoa';
import { user as User } from 'prisma/prisma-client';
import JsonResult, { JsonResultType } from '../utils/json-result';

type LoginParams = {} & User;

@Route('api')
export class RootController extends Controller {
  @Get()
  public async hi(): Promise<JsonResultType<string>> {
    return JsonResult.success('hello, this is server');
  }

  @Get('login')
  public async login(@Body() requestBody: LoginParams): Promise<JsonResultType<{token: string; me: User}>> {
    const token = await login(requestBody);
    const userId = reqCtx.get('userId');
    const me = await queryOne({ id: userId });
    return JsonResult.success({ token, me });
  }
}
