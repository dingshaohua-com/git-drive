<script lang="ts">
  import EditRepoModal from '$lib/components/edit-repo-modal.svelte';
  import CreateFolderModal from '$lib/components/create-folder-modal.svelte';
  import Navigation from '$lib/components/navbar.svelte';
  import { formatFileSize, getFileIcon, getBreadcrumbs, parseGitHubUrl, buildGitHubUrl, getParentGitHubUrl } from './helper';
  import toast from '$lib/toast';

  let loading = $state(false);
  let list = $state([]);
  let showEditRepoModal = $state(false);
  let showCreateFolderModal = $state(false);
  let current = $state({
    path: '',
    repo: '',
    htmlUrl: '',
    isRoot: false,
  });

  // https://github.com/ghub-drive/one/blob/main/cc.gitkeep

  console.log();

  const syncAnyLevel = async (htmlUrl: string = '') => {
    const { owner, repo, branch, path, isRoot } = parseGitHubUrl(htmlUrl);
    current.path = path;
    current.repo = repo;
    current.htmlUrl = htmlUrl;
    current.isRoot = isRoot;
    loading = true;
    // 判断是否获取仓库列表（如果为'/'，则是）
    if (isRoot) {
      list = await api.repo.list();
    } else {
      list = await api.repo.get({ repo, path });

      console.log(222);
    }
    loading = false;
  };

  syncAnyLevel('https://github.com/ghub-drive');

  function goBack() {
    //
    const parentPath = getParentGitHubUrl(current.htmlUrl);
    console.log(9999, current.htmlUrl, parentPath);

    syncAnyLevel(parentPath);
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

  // 创建文件夹成功后的回调
  function handleFolderCreated() {
    syncAnyLevel(currentPath);
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
              <!-- 工具栏 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  {#if !current.isRoot}
                    <button onclick={goBack} class="cursor-pointer p-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
                      <i class="ri-arrow-left-line text-lg"></i>
                    </button>
                  {/if}
                  <button onclick={() => syncAnyLevel(current.htmlUrl)} class="cursor-pointer p-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                    <i class="ri-refresh-line text-lg"></i>
                  </button>
                </div>
                <div class="flex items-center space-x-2">
                  {#if current.isRoot}
                    <button title="新建仓库" class="cursor-pointer p-1 rounded hover:bg-blue-100 transition-colors" onclick={() => alert('新建仓库功能待实现')}>
                      <i class="ri-file-add-line text-xl text-blue-600"></i>
                    </button>
                  {:else}
                    <button title="新建文件夹" class="cursor-pointer p-1 rounded hover:bg-green-100 transition-colors" onclick={() => (showCreateFolderModal = true)}>
                      <i class="ri-folder-add-line text-xl text-green-600"></i>
                    </button>
                    <button title="上传文件" class="cursor-pointer p-1 rounded hover:bg-purple-100 transition-colors" onclick={triggerUpload}>
                      <i class="ri-upload-2-line text-xl text-purple-600"></i>
                    </button>
                    <input type="file" bind:this={uploadInput} class="hidden" onchange={handleUploadFile} />
                  {/if}
                </div>
              </div>
              <!-- 面包屑 -->
              <div class="mt-3 flex items-center flex-wrap text-sm text-gray-600 h-6">
                {#if current.repo}/{current.repo}/{/if}{current.path}
                <!-- {#each getBreadcrumbs(currentPath) as crumb, index (crumb.path)}
                  <div class="flex items-center">
                    {#if index > 0}<span class="mx-2">/</span>{/if}
                    <button onclick={() => syncAnyLevel(crumb.path)} class="hover:text-blue-600 transition-colors {index === getBreadcrumbs(currentPath).length - 1 ? 'font-medium text-gray-900' : ''}">
                      {crumb.name}
                    </button>
                  </div>
                {/each} -->
              </div>
              <hr class="my-2 border-gray-200" />
              <!-- 文件列表 -->
              <div class="p-4 relative min-h-60">
                {#if loading}
                  <div class="absolute inset-0 bg-white/88 flex items-center justify-center z-10">
                    <div class="text-center text-gray-500">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      加载中...
                    </div>
                  </div>
                {/if}
                
                {#if list.length === 0 && !loading}
                  <div class="text-center py-12 text-gray-500">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <p>此目录为空</p>
                  </div>
                {:else if list.length > 0}
                  <div class="flex flex-wrap gap-4">
                    {#each list as item (item.path)}
                      <div class="w-24 border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors">
                        <div class="flex flex-col items-center cursor-pointer" onclick={() => syncAnyLevel(item.html_url)}>
                          <i class="{getFileIcon(item)} text-3xl"></i>
                          <div class="mt-1 w-full text-center">
                            <p class="text-xs font-medium text-gray-900 truncate" title={item.name}>
                              {item.name}
                            </p>
                            {#if item.type === 'file'}
                              <p class="text-xs text-gray-500">
                                {formatFileSize(item.size)}
                              </p>
                            {/if}
                          </div>
                        </div>
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
  </div>
</div>
<EditRepoModal visible={showEditRepoModal} />
<!-- <CreateFolderModal bind:visible={showCreateFolderModal} {current.htmlUrl} onSuccess={handleFolderCreated} /> -->
