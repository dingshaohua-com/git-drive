import fs from 'fs-extra';
import crypto from 'crypto';
import reqCtx from '@/middleware/req-ctx';


// 生成非对称密钥对)
const genKeyPair = () => {
  // 生成密钥对
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 1024,
  });

  // 将密钥对转换为PEM格式的字符串
  const publicKeyStr = keyPair.publicKey
    .export({ type: "spki", format: "pem" })
    .toString();
  const privateKeyStr = keyPair.privateKey
    .export({ type: "pkcs8", format: "pem" })
    .toString();
  
  // 将密钥对字符串保存到文件中
  fs.outputFileSync("key-pair/publicKey.pem", publicKeyStr);
  fs.outputFileSync("key-pair/privateKey.pem", privateKeyStr);
};



// 使用私钥解密
export const decrypt = (encryptedData) => {
  // 将PEM格式的私钥字符串转换为KeyObject
  const privateKeyStr = reqCtx.get('sysConf').privateKey;
  const privateKey = crypto.createPrivateKey(privateKeyStr);
  // 开始解密 - 指定与前端相同的填充方式和哈希算法
  const buffer = Buffer.from(encryptedData, 'base64');
  const decrypted = crypto.privateDecrypt({
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256'  // 与前端的SHA-256保持一致
  }, buffer);
  return decrypted.toString('utf8');
};


// 使用AES密钥解密（对称加密）
export const decryptByAesStr = (encryptedData: string, aesKeyStr: string) => {
  // 读取hex格式的AES密钥
  const aesKeyHex = aesKeyStr;
  const aesKey = Buffer.from(aesKeyHex, 'hex');

  // 将Base64编码的加密数据转换为Buffer
  const encryptedBuffer = Buffer.from(encryptedData, 'base64');

  // AES-GCM格式：IV(12字节) + 密文 + 认证标签(16字节)
  const iv = encryptedBuffer.subarray(0, 12);
  const authTag = encryptedBuffer.subarray(-16); // authTag由crypto.subtle.encrypt方法生成，并且包含在加密后的数据中。
  const cipherText = encryptedBuffer.subarray(12, -16);

  // 创建解密器
  const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
  decipher.setAuthTag(authTag);

  // 解密数据
  let decrypted = decipher.update(cipherText, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};