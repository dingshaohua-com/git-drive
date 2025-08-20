import { Prisma, repo as Repo } from '@prisma/client';
import type { RepoOrDirOrFile } from '../types/repo.dto';
import JsonResult, { ApiResponse } from '../utils/json-result';
import { addFolder, queryOne, uploadFile } from '@/service/repo';
import { createGithubRepo, queryList, remove } from '@/service/repo';
import { Controller, Get, Post, Body, Route, Tags, Delete, Query, BodyProp, FormField, UploadedFile, File } from 'tsoa';

@Route('api/repo')
@Tags('repo')
export class RepoController extends Controller {
  /**
   * 获取所有仓库信息
   * @summary 列表
   */
  @Get('list')
  public async getList(): ApiResponse<RepoOrDirOrFile[]> {
    const result = await queryList('');
    return JsonResult.success(result);
  }

  /**
   * 新增仓库
   * @summary 创建
   */
  @Post()
  public async create(@Body() repo: Prisma.repoCreateInput): ApiResponse<Repo> {
    const results = await createGithubRepo(repo.rname);
    return JsonResult.success(results);
  }

  /**
   * 不单可以删除仓库，还支持删除文件夹、文件
   * @summary 删除
   */
  @Delete()
  public async remove(@Query() repo: string, @Query() path: string): ApiResponse<Repo> {
    const result = await remove(repo as string, path as string);
    return JsonResult.success(result);
  }

  /**
   * 获取仓库信息
   * @summary 查询
   */
  @Get()
  public async get(@Query() repo: string, @Query() path: string): ApiResponse<RepoOrDirOrFile[]> {
    const result = await queryOne(repo, path);
    return JsonResult.success(result);
  }

  /**
   * 创建文件夹到 repo 中
   * @summary 创建文件夹
   */
  @Post('/add-folder')
  public async addFolder(@BodyProp() repo: string, @BodyProp() path: string): ApiResponse<any> {
    const result = await addFolder(path, repo);
    return JsonResult.success(result);
  }

  /**
   * 上传文件到 repo 中
   * @summary 上传文件
   */
  @Post('/upload-file')
  public async uploadFile(@FormField() path: string, @FormField() repo: string, @UploadedFile("file") file: File): ApiResponse<any> {
    if (!file) {
      throw new Error(JSON.stringify({ fields: { file: { message: "'file' is required" } } }));
    }

    console.log('上传文件信息:', file);
    const result = await uploadFile(file, path, repo);
    return JsonResult.success(result);
  }
}
