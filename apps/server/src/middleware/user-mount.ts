// import jwt from 'jsonwebtoken';
// import context from '../utils/reques-context';

// const userMount = async (ctx, next) => {
//   if (ctx.header?.authorization) {
//     const token = ctx.header.authorization.replace('Bearer ', '');
//     try {
//       const info = jwt.verify(token, process.env.JWT_SECRET);
//       ctx.state.userId = info.id;
//       context.set('userId', ctx.state.userId);
//     } catch (err) {
//       console.error('Token 解析失败:', err);
//     }
//   }
//   await next();
// };
// export default userMount;
