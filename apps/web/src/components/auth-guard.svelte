<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { auth, me } from '$/stores';
  import { onMount } from 'svelte';

  let { children } = $props();

  // 检查是否需要重定向
  const checkAuth = () => {
    // 只在客户端执行重定向逻辑
    if (!browser) return;

    // 如果未登录且当前路径需要登录，直接重定向到登录页
    if (!$auth.isAuthenticated) {
      console.log(222);
      goto('/login', { replaceState: true });
      return;
    }

    // 如果已登录但未设置用户名，跳转到set-uname
    if (!$me.username && page.url.pathname !== '/set-uname') {
      console.log(333);
      goto('/set-uname', { replaceState: true });
      return;
    }

    // 如果在 /set-uname 页面，且已经有 username，跳转到 /home
    if (page.url.pathname === '/set-uname' && $me.username) {
      console.log(444);
      goto('/home', { replaceState: true });
      return;
    }
  };

  let mounted = false;
  onMount(async () => {
    if ($auth.isAuthenticated) {
      await me.sync();
    }
    // 后续这里不执行，交给effect监听路由变化去做
    if(!mounted){
      checkAuth();
    }
   
    mounted = true;
  });

  // 监听认证状态和路径变化
  $effect(() => {
    // 只在需要登录的页面才执行 checkAuth
    if (mounted) {
      checkAuth();
    }
  });
</script>

{#if $auth.isLoading }
  <!-- 加载状态 -->
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600">加载中...</p>
    </div>
  </div>
{:else}
  <!-- 只要不是 loading，才进入后续鉴权和页面渲染 -->
  {#if $auth.isAuthenticated && ($me.username || page.url.pathname === '/set-uname')}
    {@render children()}
  {/if}
{/if}