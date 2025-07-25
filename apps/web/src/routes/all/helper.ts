

export const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export const getFileIcon = (item: any) => {
    if (item.type === 'repo') {
        return 'ri-hard-drive-3-line text-2xl text-gray-400';
    }
    if (item.type === 'dir') {
        return 'ri-folder-fill text-2xl text-yellow-500';
    }
    if (item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return 'ri-image-fill text-2xl text-green-500';
    }
    return 'ri-file-fill text-2xl text-gray-400';
}

export const getBreadcrumbs = (currentPath: string) => {
    if (!currentPath) return [{ name: '根目录', path: '' }];
    const parts = currentPath.split('/').filter((p: string) => p);
    const breadcrumbs = [{ name: '根目录', path: '' }];
    if (parts.length > 0) {
      // 仓库名
      breadcrumbs.push({ name: parts[0], path: parts[0] });
      let currentBreadcrumbPath = parts[0];
      for (let i = 1; i < parts.length; i++) {
        currentBreadcrumbPath += '/' + parts[i];
        breadcrumbs.push({ name: parts[i], path: currentBreadcrumbPath });
      }
    }
    return breadcrumbs;
  }