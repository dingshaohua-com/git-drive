import path from "node:path";
import chalk from "chalk";
import { spawnSync } from "node:child_process";

console.log('开始生成 prisma 实体模型');

const rootPath = path.resolve(process.cwd());
console.log('rootPath', rootPath);

// const serverPath = path.resolve(rootPath, "apps", "server");
const serverPath = rootPath;




// 生成实体模型（通常位于prisma/schema.prisma）
// spawnSync('npx', ['prisma', 'db', 'pull'], {
//   cwd: serverPath,  // 关键：使用 cwd 指定工作目录
//   stdio: 'inherit', // 继承父进程的输入输出（显示日志）
//   shell: true,      // 允许使用 shell 语法（如 &&、> 等）
// });


console.log(chalk.green('prisma: 生成实体模型'));
spawnSync('pnpm dlx', ['prisma', 'db', 'pull'], {
  cwd: serverPath,  // 关键：使用 cwd 指定工作目录
  stdio: 'inherit', // 继承父进程的输入输出（显示日志）
  shell: true,      // 允许使用 shell 语法（如 &&、> 等）
});

// pnpm dlx prisma db pull


// 生成客户端代码（用户表操作，通常被放置在node_modules/.prisma/client目录下）
// spawnSync('npx', ['prisma', 'generate'], {
//   cwd: serverPath,  // 关键：使用 cwd 指定工作目录
//   stdio: 'inherit', // 继承父进程的输入输出（显示日志）
//   shell: true,      // 允许使用 shell 语法（如 &&、> 等）
// });
console.log(chalk.green('prisma: 生成客户端代码'));
spawnSync('pnpm dlx', ['prisma', 'generate'], {
  cwd: serverPath,  // 关键：使用 cwd 指定工作目录
  stdio: 'inherit', // 继承父进程的输入输出（显示日志）
  shell: true,      // 允许使用 shell 语法（如 &&、> 等）
});
// pnpm dlx prisma generate


