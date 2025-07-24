<script lang="ts">
  import { goto } from '$app/navigation';
  import {me} from "$lib/stores"

  // 状态管理
  let loading = $state(false);
  let usernameValue = $state('');
  let formData = $state({
    username: '',
  });

  // 处理设置用户名
  const handleSetAccount = async (event: Event) => {
    event.preventDefault();

    if (!formData.username) {
      alert('请输入用户名');
      return;
    }

    // 验证用户名格式
    const usernameRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    if (!usernameRegex.test(formData.username)) {
      alert('用户名只能包含字母、数字、下划线和中文');
      return;
    }

    if (formData.username.length < 2 || formData.username.length > 20) {
      alert('用户名长度为2-20个字符');
      return;
    }

    loading = true;
    try {
      const updatedUser = await api.me.put({
        ...formData,
      });
      // 这里可以添加store更新逻辑
      me.update(updatedUser);
      goto('/home', { replaceState: true });
    } catch (error) {
      alert('设置失败，请重试');
    } finally {
      loading = false;
    }
  };

  // 处理用户名输入变化
  const handleUsernameChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    usernameValue = target.value;
    formData.username = target.value;
  };
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
    <div class="text-center mb-6">
      <div class="text-4xl text-blue-500 mb-4">
        <i class="ri-user-line"></i>
      </div>
      <h2 class="text-2xl font-semibold text-gray-800 mb-2">欢迎使用GitDriver！</h2>
      <p class="text-gray-600">首次登录，请先起一个响亮的名字吧</p>
    </div>

    <form onsubmit={handleSetAccount} class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2"> 用户名 </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="ri-user-line text-gray-400"></i>
          </div>
          <input id="username" type="text" bind:value={formData.username} oninput={handleUsernameChange} placeholder="请输入用户名" required class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        {#if formData.username && (formData.username.length < 2 || formData.username.length > 20)}
          <p class="text-red-500 text-sm mt-1">用户名长度为2-20个字符</p>
        {/if}
        {#if formData.username && !/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(formData.username)}
          <p class="text-red-500 text-sm mt-1">用户名只能包含字母、数字、下划线和中文</p>
        {/if}
      </div>

      <!-- 个人主页预览 -->
      <div class=" bg-blue-50 border border-blue-200 rounded-md px-4 py-3 mb-6 text-blue-300 text-sm">
        <div class="text-opacity-1">用户名同时也将用于您个人仓库前缀，比如 <code class="bg-blue-100 px-1 rounded ">name—xxx</code></div>
      </div>

      <button type="submit" disabled={loading} class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        {#if loading}
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            设置中...
          </div>
        {:else}
          开始使用
        {/if}
      </button>
    </form>
  </div>
</div>
