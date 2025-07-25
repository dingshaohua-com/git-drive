<script lang="ts">
  import EditRepoModal from '$lib/components/edit-repo-modal.svelte';
  import Navigation from '$lib/components/navbar.svelte';
  import { createQuery } from '@tanstack/svelte-query';
  import { Button } from 'flowbite-svelte';
  import { formatFileSize, getFileIcon, getBreadcrumbs } from './helper';
  import toast from '$lib/toast';

  // 定义查询
  // const query = createQuery({
  //   queryKey: ['todos'], // 唯一标识请求的 key
  //   queryFn: () => api.repo.list(),
  // });


  let loading = $state(false);
  let list = $state([]);
  let showEditRepoModal = $state(false);
  let currentPath = $state('');
  const syncRepos = async () => {
    loading = true;
    const res = await api.repo.list();
    list = res;
    loading = false;
  }

  syncRepos();


  const toNextLevel = async (itemPath: string = '') => {
   
    if (!itemPath) {
      syncRepos();
      return;
    } else {
      const pathParts = itemPath.split('/').filter((p: string) => p);
      const isRepo = pathParts.length === 1;
      
      if (isRepo) {
        loading = true;
        const res = await api.repo.get({ repoName: pathParts.at(0) });
        list = res;
        currentPath = itemPath; // 关键：进入仓库时设置 currentPath
        loading = false;
        return;
      }
     
    }

    // currentPath = path;
    // fetchFiles(path);
  };

  function goBack() {
    const pathParts = currentPath.split('/').filter((p: string) => p);
    pathParts.pop();
    if (pathParts.length === 0) {
      toNextLevel();
      return;
    } else {
      const parentPath = pathParts.join('/');
      console.log(2233, pathParts, currentPath, parentPath);
      toNextLevel(parentPath);
    }
  }

  // let repos = $state([]);
  // let re
  // const syncRepos = async () => {
  //     const res = await api.ghub.repo.list({});
  //     console.log(res);
  //     repos = res;
  // }

  // syncRepos();

  async function fetchFiles(directory: string) {
    // loading = true;
    // try {
    //   const response = await fetch(`/file/list?directory=${directory}&showFiles=true&recursive=false`);
    //   const result = await response.json();
    //   if (result.code === 0) {
    //     const sortedFiles = result.data.sort((a: any, b: any) => {
    //       if (a.type === 'dir' && b.type === 'file') return -1;
    //       if (a.type === 'file' && b.type === 'dir') return 1;
    //       return a.name.localeCompare(b.name);
    //     });
    //     list = sortedFiles;
    //   }
    // } catch (error) {
    //   console.error('获取文件失败:', error);
    // } finally {
    //   loading = false;
    // }
  }
  let viewMode = $state<'list' | 'grid'>('list');

  async function navigateToDirectory(path: string) {
    const res = await api.ghub.repo.get({ repoName: path });
    console.log(111, res);

    // currentPath = path;
    // fetchFiles(path);
  }

  let uploadInput: HTMLInputElement | null = null;

  function triggerUpload() {
    uploadInput?.click();
  }

  async function handleUploadFile(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const formData = new FormData();
    formData.append('file', file);
    // 可选：传递当前目录
    formData.append('path', currentPath);

    loading = true;
    try {
      // 假设你的后端上传接口为 /api/file/upload
      const res = await api.repo.upload(formData);
      const result = await res.json();
     toast.success('上传成功');
    } catch (e) {
      toast.error('上传出错');
    }
    loading = false;
    // 清空 input
    if (uploadInput) uploadInput.value = '';
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
  <Navigation />
  <div class="flex-1 w-full h-full">
    <div class="py-8 w-full h-full">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex gap-6">
          <div class="flex-1 bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200 p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  {#if currentPath}
                    <button onclick={goBack} class="cursor-pointer p-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
                      <i class="ri-arrow-left-line text-lg"></i>
                    </button>
                  {/if}
                  <button onclick={() => fetchFiles(currentPath)} class="cursor-pointer p-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                    <i class="ri-refresh-line text-lg"></i>
                  </button>
                </div>
                <div class="flex items-center space-x-2">
                  <button onclick={() => (viewMode = 'list')} class="p-2 text-sm rounded transition-colors {viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"> 列表 </button>
                  <button onclick={() => (viewMode = 'grid')} class="p-2 text-sm rounded transition-colors {viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"> 网格 </button>
                  <button title="新建文件" class="cursor-pointer p-1 rounded hover:bg-blue-100 transition-colors" onclick={() => alert('新建文件功能待实现')}>
                    <i class="ri-file-add-line text-xl text-blue-600"></i>
                  </button>
                  <button title="新建文件夹" class="cursor-pointer p-1 rounded hover:bg-green-100 transition-colors" onclick={() => alert('新建文件夹功能待实现')}>
                    <i class="ri-folder-add-line text-xl text-green-600"></i>
                  </button>
                  <button title="上传文件" class="cursor-pointer p-1 rounded hover:bg-purple-100 transition-colors" onclick={triggerUpload}>
                    <i class="ri-upload-2-line text-xl text-purple-600"></i>
                  </button>
                  <input
                    type="file"
                    bind:this={uploadInput}
                    class="hidden"
                    onchange={handleUploadFile}
                  />
                </div>
              </div>
              <div class="mt-3 flex items-center flex-wrap text-sm text-gray-600">
                {#each getBreadcrumbs(currentPath) as crumb, index (crumb.path)}
                  <div class="flex items-center">
                    {#if index > 0}<span class="mx-2">/</span>{/if}
                    <button onclick={() => navigateToDirectory(crumb.path)} class="hover:text-blue-600 transition-colors {index === getBreadcrumbs(currentPath).length - 1 ? 'font-medium text-gray-900' : ''}">
                      {crumb.name}
                    </button>
                  </div>
                {/each}
              </div>

              <div class="p-4">
                {#if loading}
                  <div class="text-center py-12 text-gray-500">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    加载中...
                  </div>
                {:else if list.length === 0}
                  <div class="text-center py-12 text-gray-500">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <p>此目录为空</p>
                  </div>
                {:else if viewMode === 'list'}
                  <div class="space-y-1">
                    {#each list as item (item.path)}
                      <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div class="flex items-center space-x-3 flex-1 cursor-pointer min-w-0" onclick={() => toNextLevel(item.path)}>
                          <i class={getFileIcon(item)}></i>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate" title={item.name}>{item.name}</p>
                            <div class="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{item.type === 'dir' ? '目录' : formatFileSize(item.size)}</span>
                              <span>{new Date().toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <!-- <div class="flex items-center space-x-1 ml-2 flex-shrink-0">
                            {#if item.type === 'file'}
                              <a href={item.download_url} target="_blank" class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors whitespace-nowrap"> 查看 </a>
                              <button onclick={() => navigator.clipboard.writeText(item.download_url)} class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"> 复制 </button>
                            {/if}
                            <button onclick={() => handleDeleteFile(item)} disabled={deleting === item.path} class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors whitespace-nowrap">
                              {deleting === item.path ? '删除中' : '删除'}
                            </button>
                          </div> -->
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {#each list as item (item.path)}
                      <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div class="flex flex-col items-center cursor-pointer" onclick={() => (item.type === 'dir' ? navigateToDirectory(item.path) : null)}>
                          <i class={getFileIcon(item)}></i>
                          <p class="mt-2 text-sm font-medium text-gray-900 text-center truncate w-full" title={item.name}>
                            {item.name}
                          </p>
                          <p class="text-xs text-gray-500 mt-1">
                            {item.type === 'dir' ? '目录' : formatFileSize(item.size)}
                          </p>
                        </div>
                        <!-- <div class="mt-3 flex justify-center space-x-1">
                            {#if item.type === 'file'}
                              <a href={item.download_url} target="_blank" class="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"> 查看 </a>
                              <button onclick={() => navigator.clipboard.writeText(item.download_url)} class="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"> 复制 </button>
                            {/if}
                            <button onclick={() => handleDeleteFile(item)} disabled={deleting === item.path} class="px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors">
                              {deleting === item.path ? '删除中' : '删除'}
                            </button>
                          </div> -->
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="flex flex-col gap-2 w-full">
          {#each $query.data as reop}
            <div class="reops bg-red-500 w-20">
              <div>{reop.name}</div>
              <div>{reop.description}</div>
            </div>
          {/each}
        </div> -->
  </div>
</div>
<EditRepoModal visible={showEditRepoModal} />
