<script lang="ts">
  import { Button, Modal } from 'flowbite-svelte';
  import getFileType from '$/utils/file-type';

  let { visible = $bindable(), data } = $props();
  let fileType = $derived(data ? getFileType(data.name) : 'unknown');
  let imageLoading = $state(true);
  let imageError = $state(false);

  // 手动处理模态框关闭
  const handleClose = () => {
    visible = false;
  };

  // 图片加载成功
  const handleImageLoad = () => {
    imageLoading = false;
    imageError = false;
  };

  // 图片加载失败
  const handleImageError = () => {
    imageLoading = false;
    imageError = true;
  };

  // 当模态框打开时重置状态
  $effect(() => {
    if (visible && data) {
      imageLoading = true;
      imageError = false;
      console.log('图片预览数据:', data);
      console.log('图片URL:', data.url);
    }
  });
</script>

<Modal bind:open={visible} class="w-11/12 max-w-200" onclose={handleClose}>
  <div class="lg:h-100 h-60 flex items-center justify-center bg-gray-100 relative">
    {#if fileType === 'image'}
      <!-- 加载状态 -->
      {#if imageLoading}
        <div class="text-center absolute inset-0 flex items-center justify-center">
          <div>
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">加载图片中...</p>
          </div>
        </div>
      {/if}

      <!-- 错误状态 -->
      {#if imageError}
        <div class="text-center absolute inset-0 flex items-center justify-center">
          <i class="ri-image-line text-4xl text-gray-400 mb-2"></i>
          <p class="text-gray-600">图片加载失败</p>
          <button
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onclick={() => {
              imageLoading = true;
              imageError = false;
            }}
          >
            重试
          </button>
        </div>
      {/if}

      <!-- 图片始终渲染，通过CSS控制显示 -->
      <img src={data?.url} alt={data?.name || '图片'} class="h-full max-w-full object-contain {imageLoading || imageError ? 'opacity-0' : 'opacity-100'}" onload={handleImageLoad} onerror={handleImageError} />
    {:else}
      <div class="text-center">
        <i class="ri-file-line text-4xl text-gray-400 mb-2"></i>
        <p class="text-gray-600">暂不支持预览此类型文件</p>
        <p class="text-sm text-gray-500 mt-1">{data?.name}</p>
      </div>
    {/if}
  </div>
</Modal>
