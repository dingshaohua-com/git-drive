import chalk from 'chalk';
import path from 'node:path';
import { spawnSync } from 'node:child_process';


const rootPath = path.resolve(process.cwd());
// const serverPath = path.resolve(rootPath, "apps", "server");
const serverPath = rootPath;

// 生成实体模型（通常位于prisma/schema.prisma）：pnpm dlx prisma db pull (生产的时候注释掉，开发阶段如果数据库变化，需要放开)
// console.log(chalk.green('prisma: 生成实体模型'));
// spawnSync('pnpm dlx', ['prisma', 'db', 'pull'], {
//   cwd: serverPath, // 关键：使用 cwd 指定工作目录
//   stdio: 'inherit', // 继承父进程的输入输出（显示日志）
//   shell: true, // 允许使用 shell 语法（如 &&、> 等）
// });

// 生成客户端代码（用户表操作，通常被放置在node_modules/.prisma/client目录下）--- 给你的 ts 用：pnpm dlx prisma generate
console.log(chalk.green('prisma: 生成客户端代码'));
spawnSync('pnpm dlx', ['prisma', 'generate'], {
  cwd: serverPath, // 关键：使用 cwd 指定工作目录
  stdio: 'inherit', // 继承父进程的输入输出（显示日志）
  shell: true, // 允许使用 shell 语法（如 &&、> 等）
});
