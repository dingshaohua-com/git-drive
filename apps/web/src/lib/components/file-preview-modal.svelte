<script lang="ts">
  import { Button, Modal } from 'flowbite-svelte';
  import getFileType from '$lib/utils/file-type';

  let { visible = $bindable(), data } = $props();
  let fileType = $derived(data ? getFileType(data.name) : 'unknown');
  
  // 手动处理模态框关闭
  const handleClose = () => {
    visible = false;
  };
</script>

<Modal bind:open={visible}  class="w-11/12 max-w-200" onclose={handleClose}>
  <div class="lg:h-100 h-60 flex items-center justify-center">
    {#if fileType === 'image'}
      <img src={data?.url} alt="" class="h-full"/>
    {/if}
  </div>
  <!-- <div>123</div> -->
</Modal>
