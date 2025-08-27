<script lang="ts">
  import { goto } from '$app/navigation';
  import toast, { error } from '$/utils/toast';
  import { Modal, Spinner } from 'flowbite-svelte';
  import { slide } from 'svelte/transition';
  import '$/api/global-api'; // 确保全局 API 已初始化

  let defaultModal = $state(false);
  let isCodeSent = $state(false);
  let countdown = $state(0);
  let formData = $state({
    email: '',
    code: '',
    newPassword: ''
  });

  // 发送验证码
  const sendCode = async () => {
    if (!formData.email) {
      error('请输入邮箱地址');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      error('请输入有效的邮箱地址');
      return;
    }

    // 立即开始倒计时
    isCodeSent = true;
    let count = 60;
    countdown = count;
    const timer = setInterval(() => {
      count--;
      countdown = count;
      if (count === 0) {
        clearInterval(timer);
        isCodeSent = false;
      }
    }, 1000);

    try {
      // 这里应该调用发送重置密码验证码的API
      await api.root.sendCode({ email: formData.email, type: 'resetPwd' });
      toast.success('验证码已发送到您的邮箱');
    } catch (e: any) {
      error(e || '验证码发送失败');
      clearInterval(timer);
      isCodeSent = false;
      countdown = 0;
    }
  };

  // 重置密码
  const resetPassword = async (event: Event) => {
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

    if (!formData.code) {
      error('请输入验证码');
      return;
    }

    if (!formData.newPassword) {
      error('请输入新密码');
      return;
    }

    if (formData.newPassword.length < 6) {
      error('密码长度至少6位');
      return;
    }

    defaultModal = true;

    try {
      // 这里应该调用重置密码的API
      // await api.resetPassword({ email: formData.email, code: formData.code, newPassword: formData.newPassword });
      toast.success('密码重置成功，请使用新密码登录');
      goto('/login', { replaceState: true });
    } catch (e: any) {
      error(e || '密码重置失败');
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
        请填写以下信息来重置您的密码
      </p>
    </div>

    <!-- 统一表单 -->
    <form onsubmit={resetPassword} class="space-y-4">
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

      <!-- 验证码输入 -->
      <div class="flex">
        <input
          bind:value={formData.code}
          placeholder="请输入验证码"
          required
          class="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onclick={sendCode}
          disabled={isCodeSent}
          class="cursor-pointer w-24 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400 px-2 text-sm"
        >
          {isCodeSent ? `${countdown}s` : '发送验证码'}
        </button>
      </div>

      <!-- 新密码输入 -->
      <div>
        <input
          type="password"
          bind:value={formData.newPassword}
          placeholder="请输入新密码"
          required
          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <!-- 提交按钮 -->
      <button
        type="submit"
        class="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600 rounded-lg cursor-pointer"
      >
        重置密码
      </button>
    </form>

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
