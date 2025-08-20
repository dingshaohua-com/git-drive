import reqCtx from '@/middleware/req-ctx';
import { create, queryList } from '@/service/favorite';
import { favorite as Favorite, Prisma } from '@prisma/client';
import JsonResult, { ApiResponse } from '../utils/json-result';
import { Controller, Get, Post, Body, Route, Header, Tags, Hidden, Put } from 'tsoa';

type CreateFavoriteDto = Omit<Prisma.favoriteCreateInput, 'uid'>;

@Route('api/favorite')
@Tags('favorite')
export class FavoriteController extends Controller {
    /**
     * 获取所有仓库信息
     * @summary 列表
     */
    @Get('list')
    public async getList(): ApiResponse<Favorite[]> {
        const result = await queryList({});
        return JsonResult.success(result);
    }

    /**
     * 新增收藏
     * @summary 创建
     */
    @Post()
    public async create(@Body() favoriteParam: CreateFavoriteDto): ApiResponse<Favorite> {
        const user = reqCtx.get('user');
        const favorite: Prisma.favoriteCreateInput = {
            uid: user.id,
            ...favoriteParam,
        };
        const results = await create(favorite);
        return JsonResult.success(results);
    }
}
