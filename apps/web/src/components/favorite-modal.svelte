<script lang="ts">
  import { parseCustomUrl } from '$/routes/all/helper';
  import toast from '$/utils/toast';
  import { Button, label, Modal } from 'flowbite-svelte';
  import {me} from "$/stores";

  let { visible = $bindable(), data, onSuccess } = $props();
  let addError = $state('');
  let addLoading = $state(false);
  let folderName = $state('');
  $effect(()=>{
    if(visible){
      folderName = data.name.replace($me.username+'-','');
    }
  })

  async function onSubmit(event?: Event) {
    if (event) event.preventDefault();
    addError = '';
    if (!folderName.trim()) {
      addError = '文件夹名称不能为空';
      return;
    }

    // 验证文件夹名称格式
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(folderName)) {
      addError = '文件夹名称包含非法字符';
      return;
    }

    addLoading = true;
    try {
      // 这里需要调用创建文件夹的 API
      await api.favorite.create({
        label: folderName,
        path: data.url,
      });

      toast.success('创建成功');
      visible = false;
      folderName = ''; // 重置表单

      // 触发父组件刷新列表
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      console.error(e);
      addError = '创建失败，请重试';
    } finally {
      addLoading = false;
    }
  }

  // 当弹窗关闭时重置表单
  $effect(() => {
    if (!visible) {
      folderName = '';
      addError = '';
    }
  });
</script>

<Modal title="书签信息" bind:open={visible} autoclose={false} class="w-11/12 max-w-120">
  <form onsubmit={onSubmit} class="flex flex-col gap-4 p-2">
    <div class="flex gap-2 items-center">
      <!-- svelte-ignore component_name_lowercase -->
      <label class="font-medium text-gray-700 min-w-[60px]" for="name">名称 <span class="text-red-500">*</span></label>
      <input id="name" class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="请输入" bind:value={folderName} required autofocus />
    </div>

    <div class="flex gap-2 ">
      <span class="font-medium text-gray-700 min-w-[60px]">地址 </span>
      <span class="flex-1 px-3 focus:outline-none">{data.url}</span>
    </div>

    {#if addError}
      <div class="text-red-500 text-sm">{addError}</div>
    {/if}

    <div class="flex justify-end gap-2 mt-2">
      <button
        type="button"
        class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        onclick={() => {
          visible = false;
        }}
        disabled={addLoading}
      >
        取消
      </button>
      <Button type="submit" color="green" disabled={addLoading}>
        {#if addLoading}
          <span class="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full align-middle"></span>
        {/if}
        确定
      </Button>
    </div>
  </form>
</Modal>
