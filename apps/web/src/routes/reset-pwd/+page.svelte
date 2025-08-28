<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import toast, { error } from '$/utils/toast';
  import { Modal, Spinner } from 'flowbite-svelte';
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';
  import '$/api/global-api'; // 确保全局 API 已初始化
  import {encryptAll} from "@dingshaohua.com/hybrid-crypto/browser"
  import { loadFile } from '$/utils/common';

  let defaultModal = $state(false);

  // 从URL参数获取邮箱和验证码
  let email = $derived(page.url.searchParams.get('email') || '');
  let code = $derived(page.url.searchParams.get('code') || '');

  let formData = $state({
    newPassword: ''
  });

  // 检查URL参数是否完整
  onMount(() => {
    if (!email || !code) {
      error('缺少必要的参数，请通过邮件链接访问此页面');
      goto('/login', { replaceState: true });
    }
  });

  // 重置密码
  const resetPassword = async (event: Event) => {
    event.preventDefault();

    if (!email) {
      error('邮箱参数缺失');
      return;
    }

    if (!code) {
      error('验证码参数缺失');
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
       const publicKeyText = await loadFile('./publicKey.pem');
      const res = await encryptAll(formData.newPassword, publicKeyText)
      await api.root.resetPwd({ email, code, password: res.contentEncrypt, aseKeyEncrypt:res.aseKeyEncrypt});
      toast.success('密码重置成功!');
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

    <!-- 显示邮箱信息 -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <p class="text-sm text-gray-600">
        为邮箱 <span class="font-medium text-gray-800">{email}</span> 重置密码
      </p>
    </div>

    <!-- 统一表单 -->
    <form onsubmit={resetPassword} class="space-y-4">
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
