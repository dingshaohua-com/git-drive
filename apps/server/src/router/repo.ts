
import Router from "@koa/router";
import JsonResult from "../utils/json-result";
// import { createGithubFolder } from "../service/ghub";
// import { queryList } from "../service/ghub";
// import { listGithubRepos } from "../service/ghub";
import { getRepDir } from "../service/file";
import rootRouter from "./root";
import { queryList, queryOne } from "../service/repo";

const router = new Router({ prefix: "/api/repo" });


rootRouter.get("/repos", async (ctx) => {
    const { keyword } = ctx.query;
    try {
        const result = await queryList(keyword as string || "");
        ctx.body = JsonResult.success(result);
    } catch (e) {
        ctx.body = JsonResult.failed(e.message || "获取仓库列表失败");
    }
});


// 获取仓库目录
router.get("/", async (ctx) => {
    const { repoName } = ctx.query;
    const res = await queryOne(repoName);
    ctx.body = JsonResult.success(res);
});


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

