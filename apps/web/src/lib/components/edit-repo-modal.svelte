<script lang="ts">
  import { Button, Modal } from "flowbite-svelte";

  let { visible } = $props();
  let defaultModal = $state(false);
  let addError = $state('');
  let addLoading = $state(false);
  let repoName = $state('');
  let repoDesc = $state('');

  async function onSubmit(event?: Event) {
    if (event) event.preventDefault();
    addError = '';
    if (!repoName.trim()) {
      addError = 'repoName不能为空';
      return;
    }
    addLoading = true;
    try {
      await api.ghub.repo.add({repoName, description:repoDesc}),
      visible = false;
      // syncGitToken();
    } catch (e) {
      console.error(e);
      
      addError = '网络错误或服务器异常';
    } finally {
      addLoading = false;
    }
  }

</script>


<Modal title="仓库信息" bind:open={visible} size="md" autoclose={false}>
  <form onsubmit={onSubmit} class="flex flex-col gap-4 p-2">
    <!-- <div class="flex flex-col gap-1">
      <label class="font-medium text-gray-700">Token 名称</label>
      <input class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="如：我的主仓库Token" bind:value={tokenName} required />
    </div> -->
    <div class="flex flex-col gap-1">
      <label class="font-medium text-gray-700">名称</label>
      <input class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="请输入" bind:value={repoName} required />
    </div>
    <div class="flex flex-col gap-1">
      <label class="font-medium text-gray-700">简介</label>
      <input class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="请输入" bind:value={repoDesc} required />
    </div>
    {#if addError}
      <div class="text-red-500 text-sm">{addError}</div>
    {/if}
    <div class="flex justify-end gap-2 mt-2">
      <button
        type="button"
        class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        onclick={() => {
          defaultModal = false;
        }}
        disabled={addLoading}>取消</button
      >
      <Button type="submit" color="pink" disabled={addLoading}>
        {#if addLoading}
          <span class="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full align-middle"></span>
        {/if}
        确定
      </Button>
    </div>
  </form>
</Modal>