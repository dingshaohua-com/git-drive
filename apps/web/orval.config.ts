// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
  petstore: {
    input: 'http://localhost:3003/api/doc', // ① 规范文件
    output: {
      mode: 'tags', // ② 按 tag 分子文件，好维护
      target: './src/lib/api/endpoints', // ③ 生成 *.ts 目录
      schemas: './src/lib/api/model', // ④ 生成的类型定义目录
      mock: false, // ⑥ 同时生成 MSW mock
      clean: true, // 👈 每次生成前清目录
      override: {
        operationName: (operation, route, verb) => {
          const operationId = operation.operationId;
          if (!operationId) {
            // 如果没有 operationId，使用默认逻辑生成
            return `${verb}${route.replace(/[{}]/g, '').replace(/\//g, '')}`;
          }

          // 去掉 Controller 字段
          // 例如：'userController-get' -> 'user-get'
          // 例如：'userControllerGet' -> 'userGet'
          const newOperationId = operationId.replace(/Controller/g, '');
          console.log(newOperationId);
          
          return newOperationId;
        },
        // 自定义 axios 实例，让 Orval 知道我们的拦截器已经解构了 response.data
        mutator: {
          path: './src/lib/api/api.base.ts',
          name: 'customAxiosInstance',
        }
      },
    },
  },
});
