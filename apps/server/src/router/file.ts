import Router from "@koa/router";
import JsonResult from "../utils/json-result";
import { upload, getRepDir, getDirectoryFiles, deleteFile, getDirectoryTree, getGithubUserInfo } from "../service/file";

const router = new Router({ prefix: "/api/file" });

router.get("/", async (ctx, next) => {
  ctx.body = "Hello this is file uploader";
});

// 获取用户信息
router.get("/user-info", async (ctx) => {
  const { token } = ctx.query;
  const res = await getGithubUserInfo(token);
  ctx.body = JsonResult.success(res);
});


// 获取仓库目录
router.get("/dir", async (ctx) => {
  const res = await getRepDir();
  ctx.body = JsonResult.success(res);
});

// 文件上传
router.post("/upload", async (ctx) => {
  const { file } = ctx.request.files;
  const { directory } = ctx.request.body; // 从 body 中获取 directory 参数
  console.log('上传文件:', file, '目录:', directory);
  
  const res = await upload(file, directory);
  const { newFilename, filepath } = file; // 上传上来的文件名和路径
  console.log('上传成功：', filepath);
  ctx.body = JsonResult.success(res);
});

// 获取指定目录下的文件列表
router.get("/files", async (ctx) => {
  const { directory, showFiles, recursive } = ctx.query;
  // 允许 directory 为空字符串（表示根目录）
  // 解析参数，设置默认值
  const showFilesParam = showFiles === 'false' ? false : true;
  const recursiveParam = recursive === 'false' ? false : true;
  
  const res = await getDirectoryFiles(directory || '', showFilesParam, recursiveParam);
  ctx.body = JsonResult.success(res);
});

// 删除文件
router.delete("/file", async (ctx) => {
  const { filePath } = ctx.query;
  console.log('删除文件:', filePath);
  
  if (!filePath) {
    ctx.body = JsonResult.failed('文件路径不能为空');
    return;
  }
  try {
    await deleteFile(filePath);
    ctx.body = JsonResult.success('删除成功');
  } catch (error) {
    ctx.body = JsonResult.failed(error.message);
  }
});

// 获取目录树
router.get("/dir-tree", async (ctx) => {
  try {
    const tree = await getDirectoryTree();
    // 添加根目录
    const rootTree = {
      name: '根目录',
      path: '',
      children: tree
    };
    ctx.body = JsonResult.success(rootTree);
  } catch (error) {
    ctx.body = JsonResult.failed(error.message);
  }
});

export default router;
