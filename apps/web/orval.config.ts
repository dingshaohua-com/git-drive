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
      
      },  
    },
  },
});
