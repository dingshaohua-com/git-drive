export default class NormalError extends Error {
  constructor(message, extraData?) {
    super(message); // 必须调用 super()
    this.name = 'NormalError'; // 覆盖错误名称
    // this.extraData = extraData; // 自定义属性
  }
}

// // 使用
// try {
//   throw new MyCustomError('Something went wrong!', { userId: 42 });
// } catch (err) {
//   if (err instanceof MyCustomError) {
//     console.log(err.name); // "MyCustomError"
//     console.log(err.extraData); // { userId: 42 }
//   }
// }