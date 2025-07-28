import rootRouter from './root';
import Router from '@koa/router';
import JsonResult from '../utils/json-result';
import { queryList, queryOne, uploadFile, addFolder, remove, createGithubRepo } from '../service/repo';

const router = new Router({ prefix: '/api/repo' });


rootRouter.get('/repos', async (ctx) => {
  const { keyword } = ctx.query;
  const result = await queryList((keyword as string) || '');
  ctx.body = JsonResult.success(result);
});

// 创建仓库
router.post('/', async (ctx) => {
  const { repoName, description } = ctx.request.body;
  const result = await createGithubRepo(repoName, description);
  ctx.body = JsonResult.success(result);
});


// 删除文件或文件夹
router.delete('/', async (ctx) => {
  const { repo, path } = ctx.query;
  const result = await remove(repo as string, path as string);
  ctx.body = JsonResult.success(result);
});

// 获取仓库信息
router.get('/', async (ctx) => {
  const { repo, path } = ctx.query;
  const res = await queryOne(repo as string, path as string);
  ctx.body = JsonResult.success(res);
});

// 创建文件夹到 repo 中
router.post('/add-folder', async (ctx) => {
  const { path, repo } = ctx.request.body;
  const result = await addFolder(path, repo);
  ctx.body = JsonResult.success(result);
});

// 上传文件到 repo 中
router.post('/upload-file', async (ctx) => {
  const { file } = ctx.request.files || {};
  const { path, repo } = ctx.request.body; // 从 body 中获取 path 参数

  const res = await uploadFile(file, path, repo);
  ctx.body = JsonResult.success(res);
});

export default router;
