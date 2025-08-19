#!/usr/bin/env node

/**
 * 重命名 endpoints 脚本
 * 将 Me-Update -> update, Me-Get -> get 等
 * 移除前缀并将方法名首字母改为小写
 * 
 * 使用方法：
 * node scripts/rename-endpoints.js
 */

import fs from 'fs';
import path from 'path';

// 配置
const ENDPOINTS_DIR = './src/lib/api/endpoints';

/**
 * 转换方法名
 * 例如：'Me-Update' -> 'update'
 * 例如：'User-Get' -> 'get'
 * 例如：'Order-Create' -> 'create'
 */
function transformMethodName(methodName) {
  if (!methodName) return methodName;
  
  // 处理带连字符的格式：Me-Update -> update
  if (methodName.includes('-')) {
    const parts = methodName.split('-');
    if (parts.length >= 2) {
      const action = parts[parts.length - 1]; // 取最后一部分
      return action.charAt(0).toLowerCase() + action.slice(1); // 首字母小写
    }
  }
  
  // 处理驼峰命名：MeUpdate -> update
  const match = methodName.match(/^[A-Z][a-z]*([A-Z].*)$/);
  if (match && match[1]) {
    return match[1].charAt(0).toLowerCase() + match[1].slice(1);
  }
  
  return methodName;
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  // 读取文件内容
  const content = fs.readFileSync(filePath, 'utf8');
  
  let newContent = content;
  let hasChanges = false;
  const renames = new Map(); // 记录重命名映射
  
  // 匹配导出的函数：export const Me-Update = 
  const functionRegex = /export const ([A-Za-z]+-[A-Za-z]+|[A-Z][a-z]*[A-Z][A-Za-z]*) = /g;
  
  // 替换函数定义
  newContent = newContent.replace(functionRegex, (match, oldName) => {
    const newName = transformMethodName(oldName);
    if (newName !== oldName) {
      console.log(`  Renaming function: ${oldName} -> ${newName}`);
      hasChanges = true;
      renames.set(oldName, newName);
      return match.replace(oldName, newName);
    }
    return match;
  });
  
  // 匹配类型定义：export type MeGetResult = NonNullable<Awaited<ReturnType<typeof Me-Get>>>
  const typeRegex = /export type ([A-Za-z]+-?[A-Za-z]*Result) = NonNullable<Awaited<ReturnType<typeof ([A-Za-z]+-[A-Za-z]+|[A-Z][a-z]*[A-Z][A-Za-z]*)>>>/g;
  
  // 替换类型定义
  newContent = newContent.replace(typeRegex, (match, typeName, functionName) => {
    const newFunctionName = transformMethodName(functionName);
    if (newFunctionName !== functionName) {
      // 同时更新类型名：MeUpdateResult -> UpdateResult
      const newTypeName = typeName.replace(/^[A-Za-z]+/, newFunctionName.charAt(0).toUpperCase() + newFunctionName.slice(1));
      console.log(`  Renaming type: ${typeName} -> ${newTypeName}`);
      console.log(`  Updating type reference: ${functionName} -> ${newFunctionName}`);
      hasChanges = true;
      return `export type ${newTypeName} = NonNullable<Awaited<ReturnType<typeof ${newFunctionName}>>>`;
    }
    return match;
  });
  
  // 更新其他引用
  if (hasChanges) {
    renames.forEach((newName, oldName) => {
      // 更新函数调用引用（但要小心不要替换已经处理过的）
      const callRegex = new RegExp(`\\b${oldName.replace(/[-]/g, '\\-')}\\b`, 'g');
      newContent = newContent.replace(callRegex, (match, offset) => {
        // 检查是否在已经处理过的 export 语句中
        const beforeMatch = newContent.substring(0, offset);
        const lastExport = beforeMatch.lastIndexOf('export');
        const nextNewline = newContent.indexOf('\n', offset);
        
        if (lastExport !== -1 && nextNewline !== -1) {
          const exportLine = newContent.substring(lastExport, nextNewline);
          if (exportLine.includes('export const') || exportLine.includes('export type')) {
            return match; // 不替换 export 语句中的
          }
        }
        
        return newName;
      });
    });
  }
  
  if (hasChanges) {
    fs.writeFileSync(filePath, newContent);
    console.log(`  ✅ Updated: ${filePath}`);
  } else {
    console.log(`  ⏭️  No changes: ${filePath}`);
  }
}

/**
 * 递归处理目录
 */
function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return;
  }
  
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      processFile(filePath);
    }
  });
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 Starting endpoint renaming...\n');
  
  try {
    processDirectory(ENDPOINTS_DIR);
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  transformMethodName,
  processFile,
  processDirectory
};
