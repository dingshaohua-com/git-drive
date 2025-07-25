import Router from "@koa/router";
import JsonResult from "../utils/json-result";
import { createGithubFolder } from "../service/ghub";
import { createGithubRepo } from "../service/ghub";
import { listGithubRepos } from "../service/ghub";
import { getRepDir } from "../service/file";


const router = new Router({ prefix: "/api/ghub" });

// router.get("/", async (ctx) => {
//   ctx.body = JsonResult.success("ghub");
// });
router.post("/create-folder", async (ctx) => {
  const { repo, path, branch } = ctx.request.body;
  if (!repo || !path) {
    ctx.body = JsonResult.failed("repo 和 path 必填");
    return;
  }
  try {
    const result = await createGithubFolder(repo, path);
    ctx.body = JsonResult.success(result);
  } catch (e) {
    ctx.body = JsonResult.failed(e.message || "创建文件夹失败");
  }
});

router.post("/repo", async (ctx) => {
  const { repoName, description } = ctx.request.body;
  if (!repoName) {
    ctx.body = JsonResult.failed("仓库名字必填");
    return;
  }
  try {
    const result = await createGithubRepo(repoName, description);
    ctx.body = JsonResult.success(result);
  } catch (e) {
    ctx.body = JsonResult.failed(e.message || "创建仓库失败");
  }
});

router.get("/repos", async (ctx) => {
  const { keyword } = ctx.query;
  try {
    const result = await listGithubRepos(keyword as string || "");
    ctx.body = JsonResult.success(result);
  } catch (e) {
    ctx.body = JsonResult.failed(e.message || "获取仓库列表失败");
  }
});

// 获取仓库目录
router.get("/repo", async (ctx) => {
  const { repoName } = ctx.query;
  const res = await getRepDir(repoName);
  ctx.body = JsonResult.success(res);
});



export default router;