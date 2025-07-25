<script lang="ts">
  import EditRepoModal from '$lib/components/edit-repo-modal.svelte';
import Navigation from '$lib/components/navbar.svelte';
  import { createQuery } from '@tanstack/svelte-query';
  import { Button } from 'flowbite-svelte';

  // 定义查询
  const query = createQuery({
    queryKey: ['todos'], // 唯一标识请求的 key
    queryFn: () => api.ghub.repo.list({}),
  });

  

  // let repos = $state([]);
  // let re
  // const syncRepos = async () => {
  //     const res = await api.ghub.repo.list({});
  //     console.log(res);
  //     repos = res;
  // }

  // syncRepos();

  let showEditRepoModal = $state(false);
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
  <Navigation />
  <div class="flex-1 flex flex-col items-center justify-center w-full">
    {#if $query.isLoading}
      <p>Loading...</p>
    {:else if $query.isError}
      <p>Error: {$query.error.message}</p>
    {:else if $query.isSuccess}
      {#if $query.data.length === 0}
        暂无数据，<Button onclick={() => (showEditRepoModal = true)}>点此添加</Button>
      {:else }
      <div class="flex flex-col gap-2 w-full">
        {#each $query.data as reop}
        <div class="reops bg-red-500 w-20">
          <div>{reop.name}</div>
          <div>{reop.description}</div>
        </div>
      {/each}
      </div>
     
      {/if}
    {/if}
  </div>
</div>
<EditRepoModal visible={showEditRepoModal} />
