/**
 * 类型测试文件
 * 用于验证 API 返回类型是否正确
 */

import { login } from './endpoints/root';
import type { JsonResultTypeTokenStringMeUser } from './model';

// 测试函数：验证登录 API 的返回类型
export async function testLoginTypes() {
  // 模拟登录参数
  const loginParams = {
    email: 'test@example.com',
    code: '123456'
  };

  try {
    // 调用登录 API
    const result = await login(loginParams);
    
    // 现在应该可以直接访问这些属性，而不需要 .data
    console.log('用户信息:', result.me);
    console.log('Token:', result.token);
    
    // 这些应该有正确的类型提示
    const userEmail = result.me.email; // 应该是 string | null
    const userId = result.me.id; // 应该是 string
    const token = result.token; // 应该是 string
    
    return {
      user: result.me,
      token: result.token
    };
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

// 类型检查：确保返回类型正确
type LoginResult = Awaited<ReturnType<typeof login>>;
// LoginResult 应该是 JsonResultTypeTokenStringMeUserData，而不是 JsonResultTypeTokenStringMeUser

// 验证类型结构
const typeCheck = {} as LoginResult;
const userInfo = typeCheck.me; // 应该有类型提示
const tokenValue = typeCheck.token; // 应该有类型提示
