<script lang="ts">
  import { parseCustomUrl } from '$/routes/all/helper';
  import toast from '$/utils/toast';
  import { Button, fileupload, Modal } from 'flowbite-svelte';
  import { checkNormalStr } from '$/utils/form-check';

  let { visible = $bindable(), currentPath = '', onSuccess, data } = $props();
  let addError = $state('');
  let addLoading = $state(false);
  let folderName = $state('');

  async function onSubmit(event?: Event) {
    if (event) event.preventDefault();
    const isEdit = !!data;
    addError = checkNormalStr(folderName) || '';
    if (addError) return;
    addLoading = true;
    const { repo, path } = parseCustomUrl(currentPath);
    try {
      if (isEdit) {
        await api.repo.rename({
          repo,
          path: path,
          oldName: data.name,
          newName: folderName.trim(),
        });
        
      } else {
        // 这里需要调用创建文件夹的 API
        await api.repo.addFolder({
          repo,
          path: path + (path ? '/' : '') + folderName.trim(),
        });
      }

      toast.success('保存成功');
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
    } else {
      folderName = data?.name || '';
    }
  });
</script>

<Modal title={data ? '编辑文件夹' : '新建文件夹'} bind:open={visible} autoclose={false} class="w-11/12 max-w-120">
  <form onsubmit={onSubmit} class="flex flex-col gap-4 p-2">
    <div class="flex gap-2 items-center">
      <label class="font-medium text-gray-700 min-w-[60px]">文件夹名称 <span class="text-red-500">*</span></label>
      <input class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" placeholder="请输入" bind:value={folderName} required autofocus />
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
        保存
      </Button>
    </div>
  </form>
</Modal>
