<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import Navbar from '$/components/navbar.svelte';
  import { parseCustomUrl } from '../all/helper';
  import { goto } from '$app/navigation';
  import { me } from '$/stores';

  const getPurePath = (path: string) => {
    return path.replace($me.username+'-','');
  };

  const query = createQuery({
    queryKey: ['favorites'],
    queryFn: () => api.favorite.getList(),
  });

  const goFile = (item: any) => {
    const { repo, path } = parseCustomUrl(item.path);
    const params = new URLSearchParams();
    if (repo) params.set('repo', repo);
    if (path) params.set('path', path);
    goto(`/all?${params.toString()}`, { replaceState: true });
  };

  // 获取显示路径
  const getDisplayPath = (favorite: any) => {
    const { repo, path } = parseCustomUrl(favorite.path);
    if (!path) {
      return `/${repo}`;
    }
    return `/${repo}/${path}`;
  };

  // 获取简短描述
  const getDescription = (favorite: any) => {
    const { repo, path } = parseCustomUrl(favorite.path);
    if (!path) {
      return '仓库根目录';
    }

    const isFolder = !path.includes('.') || path.endsWith('/');
    if (isFolder) {
      return '文件夹';
    }

    const ext = path.split('.').pop()?.toLowerCase();
    const fileName = path.split('/').pop();
    return fileName || '文件';
  };
</script>

<Navbar />
<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
  <!-- 主要内容 -->
  <main class="pt-20 pb-8">
    <div class="max-w-7xl mx-auto px-6">
       <!-- 统计信息 -->
      {#if $query.isSuccess && $query.data && $query.data.length > 0}
        <div class="mb-6">
          <p class="text-sm text-gray-500">
            共 <span class="font-medium text-gray-700">{$query.data.length}</span> 个收藏项
          </p>
        </div>
      {/if}

      <!-- 收藏列表 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {#if $query.isLoading}
          <div class="flex items-center justify-center py-16">
            <div class="flex items-center space-x-3">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span class="text-gray-600">加载中...</span>
            </div>
          </div>
        {:else if $query.isError}
          <div class="flex items-center justify-center py-16">
            <div class="text-center">
              <i class="ri-error-warning-line text-4xl text-red-500 mb-3"></i>
              <p class="text-red-600 font-medium">加载失败</p>
              <p class="text-gray-500 text-sm mt-1">{$query.error?.message || '请稍后重试'}</p>
            </div>
          </div>
        {:else if $query.isSuccess}
          {#if $query.data && $query.data.length > 0}
            <div class="divide-y divide-gray-100">
              {#each $query.data as favorite}
                <div
                  class="group cursor-pointer hover:bg-gray-50 transition-all duration-200 p-4 flex items-center space-x-4"
                  onclick={() => goFile(favorite)}
                  role="button"
                  tabindex="0"
                  onkeydown={(e) => e.key === 'Enter' && goFile(favorite)}
                >
                  <!-- 图标 -->
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 rounded-lg bg-gray-50 group-hover:bg-white border border-gray-200 group-hover:border-gray-300 flex items-center justify-center transition-all duration-200">
                      🩷
                    </div>
                  </div>

                  <!-- 内容 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-200">
                          {favorite.label}
                        </h3>
                        <p class="text-sm text-gray-500 mt-1 truncate">
                          {getDescription(favorite)} • {getPurePath(getDisplayPath(favorite))}
                        </p>
                      </div>

                      <!-- 右侧箭头 -->
                      <div class="flex-shrink-0 ml-4">
                        <i class="ri-arrow-right-line text-gray-400 group-hover:text-indigo-500 transition-colors duration-200"></i>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <!-- 空状态 -->
            <div class="flex items-center justify-center py-16">
              <div class="text-center">
                <i class="ri-bookmark-line text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">暂无收藏</h3>
                <p class="text-gray-500 mb-6">您还没有收藏任何文件或文件夹</p>
                <button
                  class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  onclick={() => goto('/all')}
                >
                  <i class="ri-add-line mr-2"></i>
                  去添加收藏
                </button>
              </div>
            </div>
          {/if}
        {/if}
      </div>

     
    </div>
  </main>
</div>
