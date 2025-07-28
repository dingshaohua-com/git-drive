<script lang="ts">
  import EditRepoModal from '$lib/components/edit-repo-modal.svelte';
  import CreateFolderModal from '$lib/components/create-folder-modal.svelte';
  import Navigation from '$lib/components/navbar.svelte';
  import ContextMenu from '$lib/components/context-menu.svelte';
  import { formatFileSize, getFileIcon, parseGitHubUrl, buildGitHubUrl, getParentGitHubUrl } from './helper';
  import toast from '$lib/toast';
  import { triggerFileUpload } from '$lib/utils/file-uploader';
  import copyToClipboard from '$lib/utils/copy-helper';

  interface Item {
    name: string;
    path: string;
    html_url: string;
    download_url: string;
    type: string;
    size: number;
    down_url: string;
  }
  let loading = $state(false);
  let list = $state<Array<Item>>([]);
  let showEditRepoModal = $state(false);
  let showCreateFolderModal = $state(false);
  let current = $state({
    path: '',
    repo: '',
    htmlUrl: '',
    isRoot: false,
  });

  const syncAnyLevel = async (htmlUrl: string) => {
    const { repo, path, isRoot } = parseGitHubUrl(htmlUrl);
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
    }
    loading = false;
  };

  syncAnyLevel('https://github.com/ghub-drive');

  function goBack() {
    const parentPath = getParentGitHubUrl(current.htmlUrl);
    syncAnyLevel(parentPath);
  }

  function triggerUpload() {
    loading = true;
    triggerFileUpload({
      path: current.htmlUrl,
      onSuccess: () => {
        syncAnyLevel(current.htmlUrl);
      },
    });
  }

  // 创建文件夹成功后的回调
  function handleFolderCreated() {
    syncAnyLevel(current.htmlUrl);
  }

  const handleRename = (item: any) => {};

  const handleDelete = async (item: any) => {
    loading = true;
    const { repo, path } = parseGitHubUrl(item.html_url);
    await api.repo.remove({ repo, path });
    syncAnyLevel(current.htmlUrl);
  };

  const handleShare = (item: any) => {
    copyToClipboard(item.down_url);
    toast.success('分享链接已复制');
  };

  const createRepo = () => {
    showEditRepoModal = true;
  };
  const handleRepoCreated = () => {
    syncAnyLevel('https://github.com/ghub-drive');
  };

  const clickItem = (item: Item) => {
    if (item.type === 'file') {
      handleShare(item);
      setTimeout(() => {
        window.open(item.down_url);
      }, 1000);
    } else {
      syncAnyLevel(item.html_url);
    }
  };
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
                    <button title="新建仓库" class="cursor-pointer p-1 rounded hover:bg-blue-100 transition-colors" onclick={createRepo}>
                      <i class="ri-file-add-line text-xl text-blue-600"></i>
                    </button>
                  {:else}
                    <button title="新建文件夹" class="cursor-pointer p-1 rounded hover:bg-green-100 transition-colors" onclick={() => (showCreateFolderModal = true)}>
                      <i class="ri-folder-add-line text-xl text-green-600"></i>
                    </button>
                    <button title="上传文件" class="cursor-pointer p-1 rounded hover:bg-purple-100 transition-colors" onclick={triggerUpload}>
                      <i class="ri-upload-2-line text-xl text-purple-600"></i>
                    </button>
                  {/if}
                </div>
              </div>
              <!-- 面包屑 -->
              <div class="mt-3 flex items-center flex-wrap text-sm text-gray-600 h-6">
                {#if current.isRoot}
                  <span class="font-medium text-gray-900">仓库列表</span>
                {:else}
                  <button onclick={() => syncAnyLevel('https://github.com/ghub-drive')} class="hover:text-blue-600 transition-colors"> 仓库列表 </button>
                  <span class="mx-2">/</span>
                  <button onclick={() => syncAnyLevel(buildGitHubUrl({ repo: current.repo }))} class="hover:text-blue-600 transition-colors {!current.path ? 'font-medium text-gray-900' : ''}">
                    {current.repo}
                  </button>
                  {#if current.path}
                    {#each current.path.split('/').filter((p) => p) as segment, index}
                      <span class="mx-2">/</span>
                      {@const segmentPath = current.path
                        .split('/')
                        .slice(0, index + 1)
                        .join('/')}
                      <button onclick={() => syncAnyLevel(buildGitHubUrl({ repo: current.repo, path: segmentPath, type: 'tree' }))} class="hover:text-blue-600 transition-colors {index === current.path.split('/').filter((p) => p).length - 1 ? 'font-medium text-gray-900' : ''}">
                        {segment}
                      </button>
                    {/each}
                  {/if}
                {/if}
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

                {#if list.filter((item) => item.name !== '.gitkeep').length === 0 && !loading}
                  <div class="text-center py-12 text-gray-500">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9a2 2 0 01-2-2z" />
                    </svg>
                    <p>此目录为空</p>
                  </div>
                {:else if list.filter((item) => item.name !== '.gitkeep').length > 0}
                  <div class="flex flex-wrap gap-4">
                    {#each list.filter((item) => item.name !== '.gitkeep') as item (item.path)}
                      <ContextMenu>
                        {#snippet children()}
                          <div class="w-24 h-20 border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors">
                            <div class="flex flex-col items-center cursor-pointer" onclick={() => clickItem(item)}>
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
                        {/snippet}

                        {#snippet menu()}
                          <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors" onclick={() => handleRename(item)}>
                            <i class="ri-edit-line text-blue-500"></i>
                            <span>重命名</span>
                          </button>
                          <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors" onclick={() => handleDelete(item)}>
                            <i class="ri-delete-bin-line text-red-500"></i>
                            <span>删除</span>
                          </button>
                          {#if item.type === 'file'}
                            <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors" onclick={() => handleShare(item)}>
                              <i class="ri-share-line text-red-500"></i>
                              <span>分享</span>
                            </button>
                          {/if}
                        {/snippet}
                      </ContextMenu>
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
<EditRepoModal visible={showEditRepoModal} onSuccess={handleRepoCreated} />
<CreateFolderModal bind:visible={showCreateFolderModal} currentPath={current.htmlUrl} onSuccess={handleFolderCreated} />
