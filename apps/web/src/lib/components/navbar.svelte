<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { auth, user } from '@/lib/stores';

  // 导航菜单项
  const menuItems = [
    { name: '首页', href: '/', icon: 'ri-home-line' },
    { name: '所有仓库', href: '/all-rep', icon: 'ri-git-repository-line' },
    // { name: '设置', href: '/about', icon: 'ri-settings-3-line' },
  ];

  // 用户操作菜单项
  const userMenuItems = [
    { name: '个人中心', href: '/profile', icon: 'ri-user-line' },
    { name: '退出登录', href: '/logout', icon: 'ri-logout-box-line' },
  ];

  // 获取当前登录用户信息
  const currentUser = $derived(
    $auth.isAuthenticated && $user.nickname
      ? $user
      : {
          nickname: '未登录',
          avatar: null,
        },
  );

  // 检查是否正在加载用户数据
  const isLoading = $derived($auth.isLoading || !$auth.isAuthenticated || !$user.nickname);

  // 导航到指定页面
  const navigateTo = (href: string) => {
    goto(href);
  };

  // 处理用户操作
  const handleUserAction = (href: string) => {
    if (href === '/logout') {
      auth.logout();
      // 替换当前页面，而不是添加新条目。
      goto('/', { replaceState: true });
    } else {
      navigateTo(href);
    }
  };

  // 检查当前页面是否激活
  const isActive = (href: string) => {
    return page.url.pathname === href;
  };

  // 切换移动端菜单
  let mobileMenuOpen = $state(false);
  const toggleMobileMenu = () => {
    mobileMenuOpen = !mobileMenuOpen;
  };

  // 切换用户下拉菜单
  let userDropdownOpen = $state(false);
  const toggleUserDropdown = () => {
    userDropdownOpen = !userDropdownOpen;
  };

  // 关闭用户下拉菜单
  const closeUserDropdown = () => {
    userDropdownOpen = false;
  };

  // 点击外部区域关闭下拉菜单
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      closeUserDropdown();
    }
  };
</script>

<header class="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex justify-between items-center h-20">
      <!-- 品牌Logo -->
      <div class="flex items-center space-x-4">
        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <i class="ri-git-repository-line text-white text-lg"></i>
        </div>
        <span class="text-xl font-semibold text-gray-900">GitDriver</span>
      </div>

      <!-- 桌面端导航菜单 -->
      <nav class="hidden md:flex items-center space-x-8">
        {#each menuItems as item}
          <button onclick={() => navigateTo(item.href)} class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 {isActive(item.href) ? 'text-blue-600' : ''}">
            <i class="{item.icon} text-lg"></i>
            <span>{item.name}</span>
          </button>
        {/each}
      </nav>

      <!-- 桌面端用户操作 -->
      <div class="hidden md:flex items-center">
        <div class="relative user-dropdown">
          <button onclick={toggleUserDropdown} class="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 min-w-[120px]">
            <!-- 用户头像 -->
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              {#if currentUser.avatar}
                <img src={currentUser.avatar} alt="用户头像" class="w-8 h-8 rounded-full" />
              {:else}
                <i class="ri-user-line text-white text-sm"></i>
              {/if}
            </div>
            <!-- 用户名 -->
            <span class="text-gray-700 font-medium min-w-[60px] text-left">
              {#if isLoading}
                <div class="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              {:else}
                {currentUser.nickname}
              {/if}
            </span>
            <!-- 下拉箭头 -->
            <i class="ri-arrow-down-s-line text-gray-500 transition-transform duration-200 {userDropdownOpen ? 'rotate-180' : ''} flex-shrink-0"></i>
          </button>

          <!-- 用户下拉菜单 -->
          {#if userDropdownOpen}
            <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {#each userMenuItems as item}
                <button
                  onclick={() => {
                    handleUserAction(item.href);
                    closeUserDropdown();
                  }}
                  class="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <i class="{item.icon} text-lg"></i>
                  <span>{item.name}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- 移动端菜单按钮 -->
      <button onclick={toggleMobileMenu} class="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200">
        <i class="ri-menu-line text-xl"></i>
      </button>
    </div>

    <!-- 移动端菜单 -->
    {#if mobileMenuOpen}
      <div class="md:hidden py-4 border-t border-gray-100">
        <nav class="space-y-2">
          {#each menuItems as item}
            <button
              onclick={() => {
                navigateTo(item.href);
                mobileMenuOpen = false;
              }}
              class="w-full text-left px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200 {isActive(item.href) ? 'text-blue-600 bg-blue-50' : ''}"
            >
              <div class="flex items-center space-x-3">
                <i class="{item.icon} text-lg"></i>
                <span>{item.name}</span>
              </div>
            </button>
          {/each}
        </nav>
        <!-- 移动端用户信息 -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <div class="flex items-center space-x-3 px-4 py-3 mb-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              {#if currentUser.avatar}
                <img src={currentUser.avatar} alt="用户头像" class="w-10 h-10 rounded-full" />
              {:else}
                <i class="ri-user-line text-white text-lg"></i>
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900">
                {#if isLoading}
                  <div class="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                {:else}
                  {currentUser.nickname}
                {/if}
              </div>
              <div class="text-sm text-gray-500">
                {#if isLoading}
                  <div class="w-12 h-3 bg-gray-200 rounded animate-pulse mt-1"></div>
                {:else}
                  已登录
                {/if}
              </div>
            </div>
          </div>
          <div class="space-y-1">
            {#each userMenuItems as item}
              <button
                onclick={() => {
                  handleUserAction(item.href);
                  mobileMenuOpen = false;
                }}
                class="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
              >
                <i class="{item.icon} text-lg"></i>
                <span>{item.name}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</header>

<!-- 占位符，防止内容被固定导航栏遮挡 -->
<div class="h-20"></div>
