const getFileIcon = (ext: string) => {
  switch (ext) {
    case 'drive':
      return 'ri-hard-drive-3-line text-blue-500';

    // JavaScript/TypeScript
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      return 'ri-javascript-line text-yellow-600';
    case 'vue':
    case 'svelte':
      return 'ri-vuejs-line text-green-500';

    // Web 技术
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
      return 'ri-css3-line text-blue-600';
    case 'html':
    case 'htm':
    case 'xml':
      return 'ri-html5-line text-orange-500';

    // Microsoft Office 文件
    case 'doc':
    case 'docx':
      return 'ri-file-word-2-line text-blue-600';
    case 'xls':
    case 'xlsx':
      return 'ri-file-excel-2-line text-green-600';
    case 'ppt':
    case 'pptx':
      return 'ri-file-ppt-2-line text-orange-600';

    // 配置和数据文件
    case 'json':
      return 'ri-braces-line text-green-600';
    case 'env':
    case 'yaml':
    case 'yml':
      return 'ri-file-settings-line text-purple-600';
    case 'toml':
    case 'ini':
    case 'conf':
    case 'config':
      return 'ri-settings-3-line text-gray-600';

    // 文档文件
    case 'md':
    case 'markdown':
      return 'ri-markdown-line text-gray-600';
    case 'txt':
    case 'readme':
      return 'ri-file-text-line text-gray-600';
    case 'pdf':
      return 'ri-file-pdf-line text-red-500';

    // 图片文件
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
    case 'bmp':
    case 'ico':
      return 'ri-image-line text-purple-500';

    // 压缩文件
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
    case 'bz2':
      return 'ri-file-zip-line text-gray-500';

    // 音频文件
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
    case 'm4a':
      return 'ri-music-2-line text-pink-500';

    // 视频文件
    case 'mp4':
    case 'avi':
    case 'mkv':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'webm':
      return 'ri-video-line text-red-500';

    // 编程语言
    case 'py':
    case 'pyc':
    case 'pyo':
      return 'ri-file-code-line text-blue-400';
    case 'java':
    case 'class':
    case 'jar':
      return 'ri-file-code-line text-red-500';
    case 'c':
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'h':
    case 'hpp':
      return 'ri-file-code-line text-gray-600';
    case 'php':
    case 'phtml':
      return 'ri-file-code-line text-purple-600';
    case 'rb':
    case 'gem':
      return 'ri-file-code-line text-red-400';
    case 'go':
    case 'mod':
      return 'ri-file-code-line text-cyan-500';
    case 'rs':
      return 'ri-file-code-line text-orange-700';
    case 'sh':
    case 'bash':
    case 'zsh':
    case 'fish':
      return 'ri-terminal-box-line text-gray-700';

    // 字体文件
    case 'ttf':
    case 'otf':
    case 'woff':
    case 'woff2':
    case 'eot':
      return 'ri-font-size-2 text-indigo-500';

    // 数据库文件
    case 'sql':
    case 'db':
    case 'sqlite':
    case 'mdb':
      return 'ri-database-2-line text-green-700';

    default:
      return 'ri-file-text-line text-gray-500';
  }
};

// 获取文件/文件夹图标
const getIcon = (path: string, fileType: string) => {
  if (fileType) {
    if (fileType === 'repo') {
      return 'ri-hard-drive-3-line text-blue-500';
    } else if (fileType === 'dir') {
      return 'ri-folder-fill text-yellow-500';
    }
  }

  // 根据文件扩展名返回不同图标
  const ext = path.split('.').pop()?.toLowerCase();
  
  return getFileIcon(ext);
};

export { getIcon };
