<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { auth, me } from '$lib/stores';
  import { onMount } from 'svelte';

  let { children } = $props();

  // 检查当传入路径是否需要登录（默认检查当前路径）
  const checkPublicPath = (path: string) => {
    // 当前路径（不要写默认的，必须用地方传，否则会失去响应式）
    // const currentPath = page.url.pathname;
    // 不需要登录的页面路径
    const publicPaths = ['/', '/login'];
    return publicPaths.includes(path);
  };

  // 检查是否需要重定向
  const checkAuth = () => {
    console.log('执行了');

    // 只在客户端执行重定向逻辑
    if (!browser) return;

    // 如果当前路径不需要登录，直接显示
    if (checkPublicPath(page.url.pathname)) {
      return;
    }

    // 如果未登录且当前路径需要登录，直接重定向到登录页
    if (!$auth.isAuthenticated) {
      goto('/login', { replaceState: true });
      return;
    }

    // 如果已登录但未设置用户名，跳转到set-uname
    if (!$me.username && page.url.pathname !== '/set-uname') {
      goto('/set-uname', { replaceState: true });
      return;
    }

    // 如果在 /set-uname 页面，且已经有 username，跳转到 /home
    if (page.url.pathname === '/set-uname' && $me.username) {
      goto('/home', { replaceState: true });
      return;
    }
  };

  let mounted = false;
  onMount(async () => {
    if ($auth.isAuthenticated && !checkPublicPath(page.url.pathname)) {
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
    if (!checkPublicPath(page.url.pathname) && mounted) {
      checkAuth();
    }
  });
</script>

{#if $auth.isLoading || $me.isLoading}
  <!-- 加载状态 -->
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600">加载中...</p>
    </div>
  </div>
  <!-- 不需要权限的正常显示页面内容 -->
{:else if checkPublicPath(page.url.pathname)}
  <!-- <slot /> -->
  {@render children()}
  <!-- 需要权限的页面内容展示时机：需要等待鉴权完成 && 存在用户名字段或者正在设置用户名页面（如果不判断路由则会导致先到其它路由再回set-uname） -->
{:else if $auth.isAuthenticated && ($me.username || page.url.pathname === '/set-uname')}
  <!-- <slot /> -->
  {@render children()}
  <!-- {:else}
  <div>鉴权中...</div> -->
{/if}
