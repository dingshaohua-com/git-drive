<script lang="ts">
  import '../app.css';
  import AuthGuard from '$lib/components/auth-guard.svelte';
  import '$lib/api/api.base';
  import '$lib/api/global-api';
  import { onMount } from 'svelte';
  import GlobalToast from '$lib/components/global-toast.svelte';
  import { page } from '$app/state';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  const queryClient = new QueryClient();

  let { children } = $props();

  // 检查当传入路径是否需要登录（默认检查当前路径）
  const checkPublicPath = (path: string) => {
    // 当前路径（不要写默认的，必须用地方传，否则会失去响应式）
    // const currentPath = page.url.pathname;
    // 不需要登录的页面路径
    const publicPaths = ['/', '/login'];
    return publicPaths.includes(path);
  };
</script>

<QueryClientProvider client={queryClient}>
  <!-- 公开页不包裹 AuthGuard -->
  {#if checkPublicPath(page.url.pathname)}
    {@render children()}
  {:else}
    <AuthGuard>
      {@render children()}
    </AuthGuard>
  {/if}
  <GlobalToast />
</QueryClientProvider>
