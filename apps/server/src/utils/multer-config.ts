import fs from 'fs';
import os from 'os';
import path from 'path';
import dayjs from 'dayjs';
import multer from '@koa/multer';

// 创建上传目录（最好不要配置到项目中，否则会跟随代码部署而被清空）
const uploadDir = path.join(os.tmpdir(), 'git-drive-api-uploads'); // 系统临时目录（跨平台兼容）
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, baseName + '-' + dayjs().format('YYYYMMDDHHmmss') + ext);
  },
});

const multerConfig = multer({ storage });

// 导出 storage 实例供 TSOA 使用
export default multerConfig;
