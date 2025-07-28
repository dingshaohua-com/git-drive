import rootRouter from './root';
import Router from '@koa/router';
import JsonResult from '../utils/json-result';
import { queryList, queryOne, upload, create, remove, createGithubRepo } from '../service/repo';

const router = new Router({ prefix: '/api/repo' });

router.post('/repo', async (ctx) => {
  const { repoName, description } = ctx.request.body;
  try {
    const result = await createGithubRepo(repoName, description);
    ctx.body = JsonResult.success(result);
  } catch (e) {
    ctx.body = JsonResult.failed(e.message || '创建仓库失败');
  }
});

rootRouter.get('/repos', async (ctx) => {
  const { keyword } = ctx.query;
  try {
    const result = await queryList((keyword as string) || '');
    ctx.body = JsonResult.success(result);
  } catch (e) {
    ctx.body = JsonResult.failed(e.message || '获取仓库列表失败');
  }
});

// 删除文件或文件夹
router.delete('/', async (ctx) => {
  const { repo, path } = ctx.query;
  try {
    const result = await remove(repo, path);
    ctx.body = JsonResult.success(result);
  } catch (e: any) {
    ctx.body = JsonResult.failed(e.message || '删除文件失败');
  }
});

// 获取仓库目录
router.get('/', async (ctx) => {
  const { repo, path } = ctx.query;
  const res = await queryOne(repo, path);
  ctx.body = JsonResult.success(res);
});

// 上传文件
router.post('/upload', async (ctx) => {
  const { file } = ctx.request.files;
  const { path, repo } = ctx.request.body; // 从 body 中获取 path 参数

  const res = await upload(file, path, repo);
  ctx.body = JsonResult.success(res);
});

// // 创建文件
// router.post("/", async (ctx) => {
//     const { repoName, filePath, content, message, branch } = ctx.request.body;
//     if (!repoName || !filePath || content === undefined) {
//         ctx.body = JsonResult.failed("repoName、filePath 和 content 必填");
//         return;
//     }
//     try {
//         const result = await create(repoName, filePath, content, message, branch);
//         ctx.body = JsonResult.success(result);
//     } catch (e: any) {
//         ctx.body = JsonResult.failed(e.message || "创建文件失败");
//     }
// });

// 创建文件夹
router.post('/', async (ctx) => {
  const { path, repo } = ctx.request.body;
  try {
    const result = await create(path, repo);
    ctx.body = JsonResult.success(result);
  } catch (e: any) {
    ctx.body = JsonResult.failed(e.message || '创建文件夹失败');
  }
});

// // 更新文件
// router.put("/update-file", async (ctx) => {
//     const { repoName, filePath, content, message, branch } = ctx.request.body;
//     if (!repoName || !filePath || content === undefined) {
//         ctx.body = JsonResult.failed("repoName、filePath 和 content 必填");
//         return;
//     }
//     try {
//         const result = await updateFile(repoName, filePath, content, message, branch);
//         ctx.body = JsonResult.success(result);
//     } catch (e: any) {
//         ctx.body = JsonResult.failed(e.message || "更新文件失败");
//     }
// });

// router.post("/", async (ctx) => {
//     const { repoName, description } = ctx.request.body;
//     if (!repoName) {
//         ctx.body = JsonResult.failed("仓库名字必填");
//         return;
//     }
//     try {
//         const result = await createGithubRepo(repoName, description);
//         ctx.body = JsonResult.success(result);
//     } catch (e) {
//         ctx.body = JsonResult.failed(e.message || "创建仓库失败");
//     }
// });

export default router;
