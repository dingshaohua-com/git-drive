/**
 * 全局 API 初始化
 * 将 Orval 生成的 API 函数挂载到全局对象上
 * 使用方式: api.root.login(params)
 */

// 导入所有 Orval 生成的 API 模块
import * as rootApi from './endpoints/root';
import * as meApi from './endpoints/me';
import * as repoApi from './endpoints/repo';
// 当有其他 API 模块时，在这里导入
// import * as userApi from './endpoints/user';

/**
 * 创建全局 API 对象
 */
const createGlobalApi = () => {
  const api = {
    root: rootApi,
    me: meApi,
    repo: repoApi
    // 当有其他 API 模块时，在这里添加
    // user: userApi,
  };

  return api;
};

/**
 * 初始化全局 API
 * 这个函数会在应用启动时被调用
 */
export const initGlobalApi = () => {
  const api = createGlobalApi();
  
  // 挂载到全局对象
  globalThis.api = api;
  
  
  console.log('🚀 Global API initialized:', Object.keys(api));
  
  return api;
};

// 自动初始化
initGlobalApi();
