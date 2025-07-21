<script lang="ts">
import Navigation from '../../lib/components/navbar.svelte';
import AuthGuard from '../../lib/components/auth-guard.svelte';
  import { onMount } from 'svelte';

let currentPath = $state('');
let files = $state<any[]>([]);
let loadingFiles = $state(false);
let deleting = $state('');
let viewMode = $state<'list' | 'grid'>('list');


onMount(() => {
  api.gitToken.list().then((res) => {
    console.log(res);
  });
});

async function fetchFiles(directory: string) {
  loadingFiles = true;
  try {
    const response = await fetch(`/file/files?directory=${directory}&showFiles=true&recursive=false`);
    const result = await response.json();
    if (result.code === 0) {
      const sortedFiles = result.data.sort((a: any, b: any) => {
        if (a.type === 'dir' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'dir') return 1;
        return a.name.localeCompare(b.name);
      });
      files = sortedFiles;
    }
  } catch (error) {
    console.error('获取文件失败:', error);
  } finally {
    loadingFiles = false;
  }
}

$effect(() => {
  // fetchFiles('');
});

function navigateToDirectory(path: string) {
  currentPath = path;
  fetchFiles(path);
}

function goBack() {
  const pathParts = currentPath.split('/').filter((p: string) => p);
  pathParts.pop();
  const parentPath = pathParts.join('/');
  navigateToDirectory(parentPath);
}

function getBreadcrumbs() {
  if (!currentPath) return [{ name: '根目录', path: '' }];
  const parts = currentPath.split('/').filter((p: string) => p);
  const breadcrumbs = [{ name: '根目录', path: '' }];
  let currentBreadcrumbPath = '';
  parts.forEach((part: string) => {
    currentBreadcrumbPath += (currentBreadcrumbPath ? '/' : '') + part;
    breadcrumbs.push({ name: part, path: currentBreadcrumbPath });
  });
  return breadcrumbs;
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

async function handleDeleteFile(file: any) {
  if (!confirm(`确定要删除${file.type === 'dir' ? '目录' : '文件'} "${file.name}" 吗？`)) {
    return;
  }
  deleting = file.path;
  try {
    const response = await fetch(`http://localhost:3002/file/file?filePath=${encodeURIComponent(file.path)}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (result.code === 0) {
      fetchFiles(currentPath);
    } else {
      alert(`删除失败: ${result.msg}`);
    }
  } catch (error) {
    alert('删除出错');
  } finally {
    deleting = '';
  }
}

function getFileIcon(item: any) {
  if (item.type === 'dir') {
    return 'ri-folder-fill text-2xl text-yellow-500';
  }
  if (item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return 'ri-image-fill text-2xl text-green-500';
  }
  return 'ri-file-fill text-2xl text-gray-400';
}
</script>

<AuthGuard>
  <div class="min-h-screen bg-gray-50">
    <Navigation />
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex gap-6">
          <div class="flex-1 bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200 p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <button
                    onclick={goBack}
                    disabled={!currentPath}
                    class="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    ← 返回
                  </button>
                  <button
                    onclick={() => fetchFiles(currentPath)}
                    class="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  >
                    刷新
                  </button>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    onclick={() => viewMode = 'list'}
                    class="px-3 py-2 text-sm rounded transition-colors { viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                  >
                    列表
                  </button>
                  <button
                    onclick={() => viewMode = 'grid'}
                    class="px-3 py-2 text-sm rounded transition-colors { viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                  >
                    网格
                  </button>
                </div>
              </div>
              <div class="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                {#each getBreadcrumbs() as crumb, index (crumb.path)}
                  <div class="flex items-center">
                    {#if index > 0}<span class="mx-2">/</span>{/if}
                    <button
                      onclick={() => navigateToDirectory(crumb.path)}
                      class="hover:text-blue-600 transition-colors {index === getBreadcrumbs().length - 1 ? 'font-medium text-gray-900' : ''}"
                    >
                      {crumb.name}
                    </button>
                  </div>
                {/each}
              </div>
            </div>
            <div class="p-4">
              {#if loadingFiles}
                <div class="text-center py-12 text-gray-500">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  加载中...
                </div>
              {:else if files.length === 0}
                <div class="text-center py-12 text-gray-500">
                  <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <p>此目录为空</p>
                </div>
              {:else}
                {#if viewMode === 'list'}
                  <div class="space-y-1">
                    {#each files as item (item.path)}
                      <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div 
                          class="flex items-center space-x-3 flex-1 cursor-pointer min-w-0"
                          onclick={() => item.type === 'dir' ? navigateToDirectory(item.path) : null}
                        >
                          <i class={getFileIcon(item)}></i>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate" title={item.name}>{item.name}</p>
                            <div class="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{item.type === 'dir' ? '目录' : formatFileSize(item.size)}</span>
                              <span>{new Date().toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-1 ml-2 flex-shrink-0">
                          {#if item.type === 'file'}
                            <a
                              href={item.download_url}
                              target="_blank"
                              class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors whitespace-nowrap"
                            >
                              查看
                            </a>
                            <button
                              onclick={() => navigator.clipboard.writeText(item.download_url)}
                              class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
                            >
                              复制
                            </button>
                          {/if}
                          <button
                            onclick={() => handleDeleteFile(item)}
                            disabled={$deleting === item.path}
                            class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors whitespace-nowrap"
                          >
                            {$deleting === item.path ? '删除中' : '删除'}
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {#each files  as item (item.path)}
                      <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div 
                          class="flex flex-col items-center cursor-pointer"
                          onclick={() => item.type === 'dir' ? navigateToDirectory(item.path) : null}
                        >
                          <i class={getFileIcon(item)}></i>
                          <p class="mt-2 text-sm font-medium text-gray-900 text-center truncate w-full" title={item.name}>
                            {item.name}
                          </p>
                          <p class="text-xs text-gray-500 mt-1">
                            {item.type === 'dir' ? '目录' : formatFileSize(item.size)}
                          </p>
                        </div>
                        <div class="mt-3 flex justify-center space-x-1">
                          {#if item.type === 'file'}
                            <a
                              href={item.download_url}
                              target="_blank"
                              class="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              查看
                            </a>
                            <button
                              onclick={() => navigator.clipboard.writeText(item.download_url)}
                              class="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            >
                              复制
                            </button>
                          {/if}
                          <button
                            onclick={() => handleDeleteFile(item)}
                            disabled={$deleting === item.path}
                            class="px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                          >
                            {$deleting === item.path ? '删除中' : '删除'}
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</AuthGuard>
