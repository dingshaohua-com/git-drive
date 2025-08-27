// // 1. 账号 + 密码
// type AccountLogin = {
//   account: string;
//   password: string;
//   email?: never;
//   phone?: never;
//   code?: never;
// };

// // 2. 邮箱 + 验证码
// type EmailLogin = {
//   email: string;
//   code: string;
//   account?: never;
//   password?: never;
//   phone?: never;
// };

// // 3. 手机号 + 验证码
// type PhoneLogin = {
//   phone: string;
//   code: string;
//   account?: never;
//   password?: never;
//   email?: never;
// };

// // 最终对外暴露的类型
// type LoginParams = AccountLogin | EmailLogin | PhoneLogin;

// export default LoginParams;


// 可以用「互斥的成对字段」思路，把 LoginParams 拆成 3 种互斥的联合类型（Discriminated Union）。
// 这样既保证了「成对出现」，也保证了「必须只出现一对」。验证示例

// const ok1: LoginParams = { account: 'abc', password: '123' };     // ✅
// const ok2: LoginParams = { email: 'a@b.com', code: '456' };       // ✅
// const ok3: LoginParams = { phone: '138', code: '789' };           // ✅

// const err1: LoginParams = { account: 'abc' };                     // ❌ 缺 password
// const err2: LoginParams = { email: 'a@b.com', password: '123' };  // ❌ 字段混用
// const err3: LoginParams = { account: 'abc', phone: '138' };       // ❌ 多对同时出现



type LoginParams = {
  account?: string;
  password?: string;
  email?: string;
  phone?: string;
  code?: string;
  aseKeyEncrypt?: string;
};
export default LoginParams;