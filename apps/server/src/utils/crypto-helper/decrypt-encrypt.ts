import reqCtx from '@/middleware/req-ctx';
import crypto, { KeyObject } from 'crypto';

// 解密--非对称密钥（rsa）
export const decryptByAsymmetric = (content: string, privateKeyParam?: KeyObject) => {
  let privateKey = privateKeyParam;
  if (!privateKey) {
    // 将PEM格式的私钥字符串转换为KeyObject
    const privateKeyStr = reqCtx.get('sysConf').privateKey;
    privateKey = crypto.createPrivateKey(privateKeyStr);
  }

  // 开始解密 - 指定与前端相同的填充方式和哈希算法
  const buffer = Buffer.from(content, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256', // 与前端的SHA-256保持一致
    },
    buffer,
  );
  return decrypted.toString('utf8');
};



// 解密--对称密钥（aes）
export const decryptBySymmetric = (content: string, aesKey: KeyObject) => {
  // 将Base64编码的加密数据转换为Buffer
  const encryptedBuffer = Buffer.from(content, 'base64');

  console.log('加密数据总长度:', encryptedBuffer.length);

  // 前端使用的AES-GCM格式：IV(12字节) + 密文 + AuthTag(16字节)
  const iv = encryptedBuffer.subarray(0, 12); // 前12字节是IV
  const encryptedData = encryptedBuffer.subarray(12); // 剩余部分是密文+AuthTag
  const authTag = encryptedData.subarray(-16); // 最后16字节是认证标签
  const cipherText = encryptedData.subarray(0, -16); // 除了最后16字节都是密文

  console.log('IV长度:', iv.length, 'AuthTag长度:', authTag.length, '密文长度:', cipherText.length);
  // 从KeyObject中提取原始密钥Buffer
  const keyBuffer = aesKey.export();

  // 创建解密器
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(authTag);
  // 解密数据
  let decrypted = decipher.update(cipherText, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};