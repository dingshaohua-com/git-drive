const pluginPath1 = require.resolve('prettier-plugin-sort-imports');
const pluginPath2 = require.resolve('prettier-plugin-svelte');

module.exports = {
  tabWidth: 2, // 缩进2个空格
  useTabs: false, // 缩进单位是否使用tab替代空格
  semi: true, // 句尾添加分号
  singleQuote: true, // 使用单引号代替双引号
  printWidth: 10000,
  plugins: [pluginPath1, pluginPath2], //如果使用 sevlet-vscode 插件格式化则不需要此
  sortingMethod: "lineLength",
  sortingOrder: "ascending",
};
