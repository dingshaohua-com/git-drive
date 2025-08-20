import dayjs from 'dayjs';
import path from 'path';

export function generateFilename(req: any, file: any, cb: any) {
  const ext = path.extname(file.originalname);
  const filename = dayjs().format('YYYYMMDDHHmmss') + ext;
  cb(null, filename);
}

export default generateFilename;
