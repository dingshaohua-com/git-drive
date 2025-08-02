import context from './req-ctx/helper';
import { queryOne } from '../service/info';

const info = async (ctx, next) => {
  const appInfo = await queryOne();
  context.set('info', appInfo);
  await next();
};

export default info;
