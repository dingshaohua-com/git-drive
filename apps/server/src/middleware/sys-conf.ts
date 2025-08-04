import context from './req-ctx';
import { queryOne } from '@/service/sys-conf';

const sysConf = async (ctx, next) => {
  const sysConf = await queryOne();
  context.set('sysConf', sysConf);
  await next();
};

export default sysConf;
