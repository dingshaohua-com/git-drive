/**
 * 把 GitHub raw 地址转换成自定义域名地址
 * @param {string} rawUrl 原始 raw.githubusercontent.com 地址
 * @returns {string}      转换后的 file.dingshaohua.com 地址
 */
export function toProxyUrl(rawUrl) {
  if(!rawUrl){return ''}
  // 正则匹配： 仓库名 / 分支 / 之后的所有路径
  const regex = /^https:\/\/raw\.githubusercontent\.com\/[^/]+\/([^/]+)\/[^/]+\/(.*)$/;
  const match = rawUrl.match(regex);
  if (!match) throw new Error('Invalid GitHub raw URL');
  const [, repo, filePath] = match;
  return `https://file.dingshaohua.com/${repo}/${filePath}`;
}

// 示例
console.log(
  toProxyUrl(
    'https://raw.githubusercontent.com/ghub-drive/one/main/a/20250727_232814179.png'
  )
);
// 输出：
// https://file.dingshaohua.com/one/a/20250727_232814179.png