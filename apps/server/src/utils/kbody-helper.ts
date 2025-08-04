import fs from 'fs';
import os from 'os';
import path from 'path';
import dayjs from 'dayjs';
import { koaBody } from 'koa-body';

// 定义上传路径（最好不要配置到项目中，否则会跟随代码部署而被清空）
const uploadDir = path.join(os.tmpdir(), 'git-drive-uploads'); // 系统临时目录（跨平台兼容）
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const kBody = koaBody({
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
});

export default kBody;
