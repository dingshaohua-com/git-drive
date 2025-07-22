<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { auth, user } from '$lib/stores';

  // 不需要登录的页面路径
  const publicPaths = ['/', '/login'];

  // 检查当前路径是否需要登录
  const isPublicPath = (path: string) => {
    return publicPaths.includes(path);
  };

  // 检查是否需要重定向
  const checkAuth = () => {
    // 只在客户端执行重定向逻辑
    if (!browser) return;

    const currentPath = page.url.pathname;

    // 如果当前路径不需要登录，直接显示
    if (isPublicPath(currentPath)) {
      return;
    }

    // 如果未登录且当前路径需要登录，直接重定向到登录页
    if (!$auth.isAuthenticated) {
      goto('/login', { replaceState: true });
      return;
    }

    // 如果已登录但未设置用户名，跳转到set-uname
    if ($auth.isAuthenticated && (!$user.nickname || $user.nickname === '') && currentPath !== '/set-uname') {
      goto('/set-uname', { replaceState: true });
      return;
    }
  };

  // 监听认证状态和路径变化
  $effect(() => {
    if ((browser && !$auth.isAuthenticated) || page.url.pathname) {
      checkAuth();
    }
  });
</script>

{#if $auth.isLoading || $user.isLoading}
  <!-- 加载状态 -->
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600">加载中...</p>
    </div>
  </div>
  <!-- 不需要权限的正常显示页面内容 -->
{:else if isPublicPath(page.url.pathname)}
  <slot />
  <!-- 需要权限的页面内容展示时机：需要等待鉴权完成 && 存在用户名字段或者正在设置用户名页面 -->
{:else if $auth.isAuthenticated && ($user.nickname || page.url.pathname === '/set-uname')}
  <slot />
<!-- {:else}
  <div>鉴权中...</div> -->
{/if}
