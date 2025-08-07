# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.


## 关于短路径
不要完全自定义配置，因为SvelteKit已经帮做了
```
You have specified a baseUrl and/or paths in your tsconfig.json which interferes with SvelteKit's auto-generated tsconfig.json. Remove it to avoid problems with intellisense. For path aliases, use `kit.alias` instead: https://svelte.dev/docs/kit/configuration#alias
```

这个警告信息是关于 SvelteKit 项目配置与 TypeScript 配置冲突的问题。我来解释一下：

1. **问题原因**：
   - 你在项目的 `tsconfig.json` 文件中设置了 `baseUrl` 和/或 `paths` 配置项
   - 这些设置会与 SvelteKit 自动生成的 TypeScript 配置产生冲突

2. **解决方案**：
   - 从你的 `tsconfig.json` 中移除 `baseUrl` 和 `paths` 配置
   - 如果需要设置路径别名(path aliases)，应该改用 SvelteKit 提供的 `kit.alias` 配置

3. **正确做法**：
   在你的 `svelte.config.js` 文件中这样配置：
   ```js
   import { vitePreprocess } from '@sveltejs/kit/vite';

   /** @type {import('@sveltejs/kit').Config} */
   const config = {
     kit: {
       alias: {
         // 你的路径别名配置
         '$lib': './src/lib',
         '$components': './src/components'
       }
     },
     preprocess: vitePreprocess()
   };

   export default config;
   ```

4. **为什么这样做**：
   - SvelteKit 会自动处理 TypeScript 配置
   - 手动设置的 `baseUrl`/`paths` 可能导致类型检查或智能提示出现问题
   - 使用 `kit.alias` 能确保路径别名在所有工具链(Vite、TypeScript等)中一致工作

5. **文档参考**：
   官方文档链接已提供：https://kit.svelte.dev/docs/configuration#alias

总结：删除 `tsconfig.json` 中的 `baseUrl` 和 `paths` 设置，改用 SvelteKit 的 `alias` 配置来定义路径别名即可解决这个问题。


## 封装api
api 是使用 orval 根据后端 openApi 动态生成的，其配置文件在 `orval.config.ts`,每次接口更新需要运行 `npm run generate-api` 生成api文件。

同时我也手动把 api 挂全局对象上了，在 `global-api.ts` 和  `app.d.ts` 有所体现！    
 如果有新的模块，需要在 `global-api.ts` 中导入并添加到 `api` 对象中，在 `app.d.ts` 中添加类型定义即可。