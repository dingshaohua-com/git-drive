<script lang="ts">
  import toast, { error } from '$/utils/toast';
  import { Modal, Spinner } from 'flowbite-svelte';
  import { slide } from 'svelte/transition';
  import '$/api/global-api'; // 确保全局 API 已初始化

  let defaultModal = $state(false);
  let isLinkSent = $state(false);
  let formData = $state({
    email: ''
  });

  // 发送重置链接
  const sendResetLink = async (event: Event) => {
    event.preventDefault();

    if (!formData.email) {
      error('请输入邮箱地址');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      error('请输入有效的邮箱地址');
      return;
    }

    defaultModal = true;

    try {
      // 这里应该调用发送重置链接的API
      await api.root.sendCode({ email: formData.email, type: 'resetPwd' });
      toast.success('重置链接已发送到您的邮箱，请查收');
      isLinkSent = true;
    } catch (e: any) {
      error(e || '重置链接发送失败');
    } finally {
      defaultModal = false;
    }
  };


</script>

<div class="min-h-screen flex items-center justify-center bg-white">
  <div class="bg-white rounded-xl md:shadow-[0_4px_8px_-4px_rgba(0,0,0,.13),0_6px_16px_0_rgba(0,0,0,.08),0_12px_24px_16px_rgba(0,0,0,.04)] p-10 w-full max-w-sm text-sm">

    <!-- 标题 -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">忘记密码</h1>
      <p class="text-gray-600 text-sm">
        {#if !isLinkSent}
          请输入您的邮箱地址，我们将发送重置链接
        {:else}
          重置链接已发送到您的邮箱，请查收邮件并按照指引重置密码
        {/if}
      </p>
      {#if !isLinkSent}
        <p class="text-gray-500 text-xs mt-2">
          链接 3 分钟内有效，请谨慎使用
        </p>
      {/if}
    </div>

    {#if !isLinkSent}
      <!-- 发送重置链接表单 -->
      <form onsubmit={sendResetLink} class="space-y-4">
        <!-- 邮箱输入 -->
        <div>
          <input
            type="email"
            bind:value={formData.email}
            placeholder="请输入邮箱地址"
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- 发送重置链接按钮 -->
        <button
          type="submit"
          class="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600 rounded-lg cursor-pointer"
        >
          发送
        </button>
      </form>
    {:else}
      <!-- 已发送状态 -->
      <div class="space-y-4">
        <div class="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <i class="ri-mail-check-line text-2xl text-green-500 mb-2"></i>
          <p class="text-green-700 text-sm">
            重置链接已发送至 <strong>{formData.email}</strong>
          </p>
          <p class="text-green-600 text-xs mt-1">
            请检查您的邮箱（包括垃圾邮件文件夹）
          </p>
        </div>

        <button
          onclick={() => isLinkSent = false}
          class="w-full h-12 bg-gray-500 hover:bg-gray-600 text-white border-gray-500 hover:border-gray-600 rounded-lg cursor-pointer"
        >
          重新发送
        </button>
      </div>
    {/if}

    <!-- 返回登录链接 -->
    <div class="mt-6 text-center">
      <a href="/login" class="text-sm text-blue-500 hover:text-blue-600">
        返回登录
      </a>
    </div>
  </div>
</div>

<Modal bind:open={defaultModal} size="xs" transition={slide} permanent>
  <div class="flex items-center justify-center min-h-20">
    <div class="text-center">
      <Spinner />
      <div class="mt-2">处理中...</div>
    </div>
  </div>
</Modal>
