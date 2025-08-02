<script lang="ts">
  import { onMount } from 'svelte';
  import { me } from '$lib/stores/me';
  import toast from '$lib/toast';
  import BasicInfo from './cmp/basic-info.svelte';
  import AccountSecurity from './cmp/account-security.svelte';
  import Navigation from '$lib/components/navbar.svelte';

  // 当前选中的标签页
  let activeTab = $state('profile');

  // 状态管理
  let isLoading = $state(false);

  // 标签页配置
  const tabs = [
    { id: 'profile', title: '基本资料', icon: 'user' },
    { id: 'security', title: '账号安全', icon: 'shield' },
  ];

  // 加载用户信息
  const loadUserInfo = async () => {
    isLoading = true;
    try {
      await me.sync();
    } catch (error) {
      toast.error('加载用户信息失败');
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    loadUserInfo();
  });
</script>

<svelte:head>
  <title>个人资料 - GitDrive</title>
</svelte:head>
<div class="min-h-screen bg-gray-50 flex flex-col ">
  <Navigation />
  <div class="container mx-auto p-4 max-w-6xl">
    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    {:else}
      <!-- 桌面端：左右布局 -->
      <div class="hidden lg:flex gap-8">
        <!-- 左侧导航 -->
        <div class="w-64 flex-shrink-0">
          <div class="sticky top-8 bg-white border border-gray-200 rounded-lg p-4">
            <div class="space-y-2">
              {#each tabs as tab}
                <button class="w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-3 {activeTab === tab.id ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-gray-600 hover:bg-gray-50'}" onclick={() => (activeTab = tab.id)}>
                  <!-- 图标 -->
                  {#if tab.icon === 'user'}
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  {:else if tab.icon === 'shield'}
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  {/if}
                  <span class="font-medium">{tab.title}</span>
                </button>
              {/each}
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="flex-1">
          {#if activeTab === 'profile'}
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <BasicInfo />
            </div>
          {:else if activeTab === 'security'}
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <AccountSecurity />
            </div>
          {/if}
        </div>
      </div>

      <!-- 手机端：上下布局 -->
      <div class="lg:hidden">
        <!-- 顶部导航 -->
        <div class="mb-6">
          <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {#each tabs as tab}
              <button class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 {activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}" onclick={() => (activeTab = tab.id)}>
                {tab.title}
              </button>
            {/each}
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          {#if activeTab === 'profile'}
            <BasicInfo />
          {:else if activeTab === 'security'}
            <AccountSecurity />
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
