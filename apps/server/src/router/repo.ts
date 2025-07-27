
import Router from "@koa/router";
import JsonResult from "../utils/json-result";
// import { createGithubFolder } from "../service/ghub";
// import { queryList } from "../service/ghub";
// import { listGithubRepos } from "../service/ghub";
import { getRepDir } from "../service/file";
import rootRouter from "./root";
import { queryList, queryOne, upload, createFile, createFolder, updateFile, deleteFile } from "../service/repo";

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
    const { repo, path } = ctx.query;
    const res = await queryOne(repo, path);
    ctx.body = JsonResult.success(res);
});


// 上传文件
router.post("/upload", async (ctx) => {
    const { file } = ctx.request.files;
    const { path } = ctx.request.body; // 从 body 中获取 path 参数
    
    const res = await upload(file, path);
    ctx.body = JsonResult.success(res);
});




// 创建文件
router.post("/create-file", async (ctx) => {
    const { repoName, filePath, content, message, branch } = ctx.request.body;
    if (!repoName || !filePath || content === undefined) {
        ctx.body = JsonResult.failed("repoName、filePath 和 content 必填");
        return;
    }
    try {
        const result = await createFile(repoName, filePath, content, message, branch);
        ctx.body = JsonResult.success(result);
    } catch (e: any) {
        ctx.body = JsonResult.failed(e.message || "创建文件失败");
    }
});

// 创建文件夹
router.post("/create-folder", async (ctx) => {
    const { path } = ctx.request.body;
    try {
        const result = await createFolder(path);
        ctx.body = JsonResult.success(result);
    } catch (e: any) {
        ctx.body = JsonResult.failed(e.message || "创建文件夹失败");
    }
});

// 更新文件
router.put("/update-file", async (ctx) => {
    const { repoName, filePath, content, message, branch } = ctx.request.body;
    if (!repoName || !filePath || content === undefined) {
        ctx.body = JsonResult.failed("repoName、filePath 和 content 必填");
        return;
    }
    try {
        const result = await updateFile(repoName, filePath, content, message, branch);
        ctx.body = JsonResult.success(result);
    } catch (e: any) {
        ctx.body = JsonResult.failed(e.message || "更新文件失败");
    }
});

// 删除文件
router.delete("/delete-file", async (ctx) => {
    const { repoName, filePath, message, branch } = ctx.request.body;
    if (!repoName || !filePath) {
        ctx.body = JsonResult.failed("repoName 和 filePath 必填");
        return;
    }
    try {
        const result = await deleteFile(repoName, filePath, message, branch);
        ctx.body = JsonResult.success(result);
    } catch (e: any) {
        ctx.body = JsonResult.failed(e.message || "删除文件失败");
    }
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

