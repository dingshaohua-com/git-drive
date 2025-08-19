import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter({
      pages: resolve('..', 'server','src', 'www'),  // 绝对路径示例
      // assets: resolve('..', 'server','src',  'public'),
      fallback: 'index.html' // SPA 回退文件
    }),
    prerender: {
      entries: ['*'] // 强制所有路由生成 HTML
    },
    alias: {
      // 你的路径别名配置
      $: './src',
      $lib: './src/lib',
    },
  },
  compilerOptions: {
    warningFilter: (warning) => {
      // 忽略 a11y 相关警告
      if (warning.code.indexOf( 'a11y') > -1) return false;
      return true;
    },
    // a11y: false
  },

  
};

export default config;
