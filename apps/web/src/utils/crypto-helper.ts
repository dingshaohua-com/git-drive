type Cfg = {
  // 算法参数，定义了生成 RSA 密钥对时使用的具体算法和相关参数，通常是一个 RsaHashedKeyGenParams 类型的对象。是生成 RSA 密钥对时的关键配置项，它包含以下字段：
  // name：指定要使用的算法名称，比如RSA-OAEP（推荐）、RSA-PSS、RSA-SHA1、RSA-SHA256、RSA-SHA384、RSA-SHA512
  // modulusLength：指定 RSA 密钥的模数长度，通常为 2048（推荐）、3072 或 4096 位
  // publicExponent：指定 RSA 公钥的公共指数，通常为 65537，0x10001（推荐 也就是new Uint8Array([1, 0, 1])）
  // hash： 指定用于 OAEP 填充的哈希函数，如 SHA-256（推荐）、SHA-384 或 SHA-512
  algorithm: RsaHashedKeyGenParams;

  // 指定生成的密钥是否可以被导出
  // - true: 密钥可以被导出为原始格式（如 CryptoKey 对象）
  // - false: 密钥不能被导出，只能在当前上下文中使用
  // 建议在安全敏感的场景中设置为 false，以防止密钥被泄露
  extractable: boolean;

  // 指定生成的密钥可以被使用的用途，常见的用途包括：
  // - 'encrypt': 密钥可用于加密数据
  // - 'decrypt': 密钥可用于解密数据
  // - 'sign': 密钥可用于生成数字签名
  // - 'verify': 密钥可用于验证数字签名
  // - 'wrapKey': 密钥可用于包装其他密钥
  // - 'unwrapKey': 密钥可用于解包其他密钥
  // - 'deriveKey': 密钥可用于派生其他密钥
  // - 'deriveBits': 密钥可用于派生位
  keyUsages: ReadonlyArray<KeyUsage>;
};

// 生成 RSA 密钥对
export async function generateKeyPair() {
  const cfg: Cfg = {
    algorithm: {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    extractable: true,
    keyUsages: ['encrypt', 'decrypt'],
  };
  const keyPair = await window.crypto.subtle.generateKey(cfg.algorithm, cfg.extractable, cfg.keyUsages);
  return keyPair;
}

// 使用公钥加密
export async function encrypt(data, publicKey) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const encrypted = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, dataBuffer);
  return encrypted;
}

// 使用私钥解密
export async function decrypt(encryptedData, privateKey) {
  const decrypted = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedData);
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
