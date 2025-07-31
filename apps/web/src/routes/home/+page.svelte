<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'
  import Navbar from '$lib/components/navbar.svelte';

  const query = createQuery({
    queryKey: ['favorites'],
    queryFn: ()=> api.favorite.list(),
  })
  
</script>

<Navbar />
<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
  <!-- 主要内容 -->
  <main class="pt-20">
    <!-- 功能说明 -->
    <section class="py-32 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div class="max-w-6xl mx-auto px-6">
        <div>
          {#if $query.isLoading}
            <p>Loading...</p>
          {:else if $query.isError}
            <p>Error: {$query.error.message}</p>
          {:else if $query.isSuccess}
            {#each $query.data as todo}
            <div class="w-24 h-20 border border-gray-200 bg-white rounded-lg p-2 hover:bg-gray-50 transition-colors flex items-center justify-center">
              {todo.label}
            </div>
              
            {/each}
          {/if}
        </div>
      </div>
    </section>
  </main>
</div>
