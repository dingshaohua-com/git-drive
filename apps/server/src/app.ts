import fs from 'fs';
import os from 'os';
import Koa from 'koa';
import path from 'path';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { koaBody } from 'koa-body';
import staticServer from 'koa-static';
import router from './router/index';
import redisJwt from './middleware/redis-jwt';
import reqCtxMw from './middleware/req-ctx/mw';
import feRouterBack from './middleware/fe-router-back';
import errorHandler from './middleware/error-handler';

// 定义上传路径（最好不要配置到项目中，否则会跟随代码部署而被清空）
const uploadDir = path.join(os.tmpdir(), 'git-drive-uploads'); // 系统临时目录（跨平台兼容）
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = new Koa();
// 错误处理中间件必须最先注册
app.use(errorHandler());
app.use(koaBody());
app.use(
  koaBody({
    multipart: true, // 开启文件上传能力
    formidable: {
      uploadDir, // 文件上传目录
      keepExtensions: true, // 保留文件扩展名
      maxFieldsSize: 2 * 1024 * 1024, // 字段大小限制为2MB
      onFileBegin: (name, file: any) => {
        const ext = path.extname(file.originalFilename);
        file.newFilename = dayjs().format('YYYYMMDDHHmmss') + ext;
        file.filepath = path.join(
          uploadDir,
          file.newFilename, // 例如: 20250728005457.jpg
        );
      }, // 传入的文件自定义名称
    },
  }),
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
