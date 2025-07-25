import Koa from 'koa';
import chalk from 'chalk';
import staticServer from 'koa-static';
import router from './router/index.ts';
import { koaBody } from 'koa-body';
import reqCtxMw from './middleware/req-ctx/mw.ts';
import feRouterBack from './middleware/fe-router-back';
import path from 'path';
import redisJwt from './middleware/redis-jwt.ts';
import fs from 'fs';
import os from 'os';

import { getTimeStr } from "./utils/time-helper";

// 定义上传路径（最好不要配置到项目中，否则会跟随代码部署而被清空）
const uploadDir = path.join(os.tmpdir(), "git-drive-uploads"); // 系统临时目录（跨平台兼容）
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = new Koa();

app.use(
  koaBody({
    multipart: true, // 开启文件上传能力
    formidable: {
      uploadDir, // 文件上传目录
      keepExtensions: true, // 保留文件扩展名
      maxFieldsSize: 2 * 1024 * 1024, // 字段大小限制为2MB
      onFileBegin: (name, file: any) => {
        const timeString = getTimeStr();
        const ext = path.extname(file.originalFilename);
        file.newFilename = timeString + ext;
        file.filepath = path.join(
          uploadDir,
          file.newFilename // 例如: 20230515_143045789.jpg
        );
      }, // 传入的文件自定义名称
    },
  })
);
app.use(staticServer(path.join(__dirname, 'www'))); // app.use(staticServer('./www'));
app.use(feRouterBack());
app.use(reqCtxMw()); // 创建上下文容器中间件
app.use(redisJwt);
app.use(router()); // 路由

app.listen(3000, '0.0.0.0', () => {
  console.log(`
    ${chalk.green('➜')}  ${chalk.bold('后端服务已启动:')}   ${chalk.blue('http://localhost:3000')}
    `);
});
