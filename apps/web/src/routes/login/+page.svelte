<script lang="ts">
  import { goto } from '$app/navigation';
  import type { QuickLoginType, LoginFieldType } from '$lib/types/auth';
  import { auth, me } from '$lib/stores';
  import toast, { error } from '$lib/toast';
  import { Modal, Spinner } from 'flowbite-svelte';
  import { slide } from 'svelte/transition';

  let defaultModal = $state(false);
  let quickLoginType = $state<QuickLoginType | null>('email');
  let isCodeSent = $state(false);
  let countdown = $state(0);
  let formData = $state<LoginFieldType>({
    email: '',
  });

  // 登录
  const onLogin = async (event: Event) => {
    event.preventDefault();
    defaultModal = true;
    try {
      await auth.login(formData);
      goto('/home', { replaceState: true });
    } catch (error) {
      console.log(9999, error);
      
      toast.error(error)
    }finally{
      defaultModal = false;
    }
   
    
  };

  // 发送验证码
  const sendCode = async () => {
    let loginData: { email?: string; phone?: string } = {};

    if (quickLoginType === 'email') {
      if (!formData.email) {
        error('请输入邮箱地址');
        return;
      }
      loginData = { email: formData.email };
    } else if (quickLoginType === 'sms') {
      if (!formData.phone) {
        error('请输入手机号');
        return;
      }
      loginData = { phone: formData.phone };
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
      await api.root.sendCode(loginData);
    } catch (e: any) {
      console.log(333, e);

      error(e || '验证码发送失败');
      clearInterval(timer);
      isCodeSent = false;
      countdown = 0;
    }
  };

  // 第三方登录
  const handleThirdPartyLogin = (type: 'wechat' | 'qq') => {
    if (type === 'wechat') {
      alert('微信登录功能开发中...');
    } else {
      alert('QQ登录功能开发中...');
    }
  };

  // 切换快捷登录类型
  const switchQuickLoginType = (type: QuickLoginType | null) => {
    quickLoginType = type;
    isCodeSent = false;
    countdown = 0;
    formData = type === 'email' ? { email: '' } : {};
  };
</script>

<div class="min-h-screen flex items-center justify-center bg-white">
  <div class="bg-white rounded-xl md:shadow-[0_4px_8px_-4px_rgba(0,0,0,.13),0_6px_16px_0_rgba(0,0,0,.08),0_12px_24px_16px_rgba(0,0,0,.04)] p-10 w-full max-w-sm text-sm">
    <!-- <img class="w-20 mx-auto rounded-full" src={logoImg} alt="" /> -->
    <div class="pt-1 h-6">
      {#if quickLoginType === 'password'}
        <div class="text-red-300 text-xs text-center">若首次使用 请选邮箱/手机，进入后再设密码即可</div>
      {/if}
    </div>

    <div class="space-y-6">
      <!-- 统一登录表单 -->
      <form onsubmit={onLogin} class="space-y-4">
        {#if quickLoginType === 'password'}
          <div class="mb-4">
            <input bind:value={formData.account} placeholder="用户名/邮箱/手机号" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <input type="password" bind:value={formData.password} placeholder="请输入密码" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none" />
          </div>
        {/if}

        {#if quickLoginType === 'email'}
          <div>
            <input type="email" bind:value={formData.email} placeholder="请输入邮箱地址" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div class="flex">
            <input bind:value={formData.code} placeholder="请输入验证码" required class="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none" />
            <button type="button" onclick={sendCode} disabled={isCodeSent} class="cursor-pointer w-24 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400 px-2 text-sm">
              {isCodeSent ? `${countdown}s` : '发送验证码'}
            </button>
          </div>
        {/if}

        {#if quickLoginType === 'sms'}
          <div>
            <input type="tel" bind:value={formData.phone} placeholder="请输入手机号" required pattern="^1[3-9]\d{9}$" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div class="flex">
            <input bind:value={formData.code} placeholder="请输入验证码" required class="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none" />
            <button type="button" onclick={sendCode} disabled={isCodeSent} class="cursor-pointer w-24 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400 px-2 text-sm">
              {isCodeSent ? `${countdown}s` : '发送验证码'}
            </button>
          </div>
        {/if}

        <button type="submit" class="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600 rounded-lg cursor-pointer"> 登录 </button>
      </form>
    </div>

    <!-- 登录方式选项 -->
    <div class="mt-5">
      <div class="flex items-center justify-center mb-4">
        <div class="flex-1 h-px bg-gray-200"></div>
        <span class="px-3 text-sm text-gray-500">登录方式</span>
        <div class="flex-1 h-px bg-gray-200"></div>
      </div>

      <div class="flex justify-center gap-4 flex-wrap">
        <button onclick={() => switchQuickLoginType('password')} class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all {quickLoginType === 'password' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
          <i class="ri-lock-line"></i>
        </button>
        <button onclick={() => switchQuickLoginType('email')} class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all {quickLoginType === 'email' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
          <i class="ri-mail-line"></i>
        </button>
        <button onclick={() => switchQuickLoginType('sms')} class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all {quickLoginType === 'sms' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
          <i class="ri-smartphone-line"></i>
        </button>
        <button onclick={() => handleThirdPartyLogin('wechat')} class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all bg-gray-100 hover:bg-green-50 text-green-500">
          <i class="ri-wechat-line"></i>
        </button>
        <button onclick={() => handleThirdPartyLogin('qq')} class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all bg-gray-100 hover:bg-green-50 text-blue-500">
          <i class="ri-qq-line"></i>
        </button>
      </div>
    </div>
  </div>
</div>

<Modal bind:open={defaultModal} size="xs" transition={slide} permanent>
  <div class="flex items-center justify-center min-h-20">
    <div class="text-center">
      <Spinner />
      <div class="mt-2">登录中...</div>
    </div>
  </div>
</Modal>
