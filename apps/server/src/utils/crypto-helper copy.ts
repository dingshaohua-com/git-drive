import fs from 'fs-extra';
import crypto from 'crypto';
import reqCtx from '@/middleware/req-ctx';
import type { KeyPairKeyObjectResult } from 'crypto';


let privateKey = fs.readFileSync('key-pair/privateKey.pem', 'utf8');
let newPwd = "ElYGNcNwTv6FpFmvFqI28nweJID9q3Lhv1RYJj4l2F1W/FfTqE3OKS24iNSybnfBXi+pS41jBpVrcUE/KyTku4GWJbca/eHJlxB88uaSyiEb9ZX+VjJzNC20O3K2QI/TkvysLm/0TwrhblvMGmEAxlaw80KT4Vc5ZeaTn5qBx8d8C9rJgCn2zoCtsuso0k16tXjllpBp8RehGBWq8XrDnGpSgz1u0Y5KhTgYKniG4ruTgfj3dhcNrzAAJUpC1cbBBMEWBgEC2ZWP4QJf7lyNvthwqoYkfIadU8z38cVPyHXGqhvq9jdIasfcbrowrTAgFYh4BZMSdz6S7v2V/0PsLQ=="

// 生成密钥对，并写入到文件
export const genKeyPair = (needExport = false) => {
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  const result: KeyPairKeyObjectResult & { publicKeyStr?: string; privateKeyStr?: string } = { ...keyPair };
  if (needExport) {
    const publicKeyStr = keyPair.publicKey.export({ type: 'spki', format: 'pem' }).toString();
    const privateKeyStr = keyPair.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
    result.publicKeyStr = publicKeyStr;
    result.privateKeyStr = privateKeyStr;
    fs.outputFileSync('key-pair/publicKey.pem', publicKeyStr);
    fs.outputFileSync('key-pair/privateKey.pem', privateKeyStr);
  }
  return result;
};

// 使用私钥解密
export const decrypt = (encryptedData) => {
  // 从数据库取出privateKey字符串
  // let { privateKey } = reqCtx.get('sysConf');
  // 将PEM格式的私钥字符串转换为KeyObject
  privateKey = crypto.createPrivateKey(privateKey);
  // 开始解密
  const buffer = Buffer.from(encryptedData, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf8');
};


// genKeyPair(true)
decrypt(newPwd);