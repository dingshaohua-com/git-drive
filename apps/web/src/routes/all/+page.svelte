<script lang="ts">
  import Navigation from '$/components/navbar.svelte';
  import FilePreviewModal from '$/components/file-preview-modal.svelte';
  import { convertPathToArray } from './helper';
  import { getIcon } from '$/utils/file-icon';
  import { triggerFileUpload } from '$/utils/file-uploader';
  import EditRepoModal from '$/components/edit-repo-modal.svelte';

  let currentPath = $state('/');
  let currentPathArray = $derived(convertPathToArray(currentPath));

  let info = $state<any>([]);
  const syncInfo = async (path = '/') => {
    currentPath = path;
    const res = await api.repo.getInfo({ path });
    info = res;
  };

  syncInfo();

  let showFilePreviewModal = $state(false);
  let previewData = $state(null);
  const goto = (item) => {
    if (item.type === 'file') {
      previewData = item;
      showFilePreviewModal = true;
    } else {
      const url = new URL(item.url);
      const path = url.pathname;
      syncInfo(path);
    }
  };

  let showFavoriteModal = $state(false);
  let showEditRepoModal = $state(false);
  let showCreateFolderModal = $state(false);
  const createRepo = () => {
    showEditRepoModal = true;
  };

  function triggerUpload() {
    // loading = true;
    triggerFileUpload({
      path: currentPath,
      onSuccess: () => {
        syncInfo(currentPath);
      },
    });
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
  <Navigation />
  <div class="flex-1 w-full h-full">
    <div class="py-8 w-full h-full">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex-1 bg-white rounded-lg shadow-md">
          <div class="border-b border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <button onclick={() => syncInfo(currentPath)} class="cursor-pointer p-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                  <i class="ri-refresh-line text-lg"></i>
                </button>
              </div>
              <div class="flex items-center space-x-2">
                {#if currentPath === '/'}
                  <button title="新建仓库" class="cursor-pointer p-1 rounded hover:bg-blue-100 transition-colors" onclick={createRepo}>
                    <i class="ri-file-add-line text-xl text-blue-600"></i>
                  </button>
                {:else}
                  <button
                    title="新建文件夹"
                    class="cursor-pointer p-1 rounded hover:bg-green-100 transition-colors"
                    onclick={() => {
                      showCreateFolderModal = true;
                    }}
                  >
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
              {#each currentPathArray as item, index}
                {#if index !== 0}
                  <i class="ri-arrow-right-s-line"></i>
                {/if}
                <div class="cursor-pointer hover:text-blue-600 transition-colors" onclick={() => syncInfo(item.path)}>
                  {item.label}
                </div>
              {/each}
            </div>
            <hr class="my-2 border-gray-200" />
            <!-- 列表 -->
            <div class="items">
              {#each info as item, index}
                <div class="item border-b border-gray-100 p-4 flex justify-between" class:border-b={index !== info.length - 1}>
                  <div class="cursor-pointer text-blue-400 flex items-center gap-1" onclick={() => goto(item)}><i class="{getIcon(item.url, item.type)} text-2xl"></i>{item.name}</div>
                  <div>操作</div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<FilePreviewModal bind:visible={showFilePreviewModal} data={previewData} />
<EditRepoModal bind:visible={showEditRepoModal} onSuccess={() => syncInfo(currentPath)} />
