<script lang="ts">
  import { Button, Label, Input } from 'flowbite-svelte';
  import { me } from '$/stores/me';
  import toast from '$/utils/toast';
  import {encryptAll} from "$/utils/crypto-helper/decrypt-encrypt"

  // 密码修改表单
  let passwordForm = $state({
    oldPassword: '',
    newPassword: '',
  });

  // 邮箱修改表单
  let emailForm = $state({
    newEmail: '',
    verificationCode: '',
  });

  // 状态管理
  let isUpdatingPassword = $state(false);
  let isUpdatingEmail = $state(false);
  let isUpdatingPhone = $state(false);
  let isSendingEmailCode = $state(false);

  // 表单验证错误
  let passwordErrors = $state({ oldPassword: '', newPassword: '' });
  let emailErrors = $state({ newEmail: '', verificationCode: '' });

  // 验证密码表单
  const validatePasswordForm = () => {
    passwordErrors = { oldPassword: '', newPassword: '' };
    if ($me.hasPwd && !passwordForm.oldPassword) passwordErrors.oldPassword = '请输入当前密码';
    if (!passwordForm.newPassword) passwordErrors.newPassword = '请输入新密码';
    else if (passwordForm.newPassword.length < 6) passwordErrors.newPassword = '密码长度不能少于6位';
    return !passwordErrors.oldPassword && !passwordErrors.newPassword;
  };

  // 验证邮箱表单
  const validateEmailForm = () => {
    emailErrors = { newEmail: '', verificationCode: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailForm.newEmail) emailErrors.newEmail = '请输入新邮箱';
    else if (!emailRegex.test(emailForm.newEmail)) emailErrors.newEmail = '请输入有效的邮箱地址';
    if (!emailForm.verificationCode) emailErrors.verificationCode = '请输入验证码';
    return !emailErrors.newEmail && !emailErrors.verificationCode;
  };

  // 更新密码
  const updatePassword = async () => {
    if (!validatePasswordForm()) return;

    isUpdatingPassword = true;
    try {
      const requestData = { newPassword: passwordForm.newPassword };
      // if ($me.hasPwd) requestData.oldPassword = passwordForm.oldPassword;

      const res = await encryptAll(requestData.newPassword);
      console.log(res);
      
      requestData.newPassword = res.contentEncrypt;
      api.me.resetPwd({newPwd: requestData.newPassword, aseKeyEncrypt: res.aseKeyEncrypt});

      // await api.me.put(requestData);
      // passwordForm = { oldPassword: '', newPassword: '' };
      // toast.success($me.hasPwd ? '密码修改成功' : '密码设置成功');
      await me.sync();
    } catch (error) {
      toast.error($me.hasPwd ? '密码修改失败' : '密码设置失败');
    } finally {
      isUpdatingPassword = false;
    }
  };

  // 发送邮箱验证码
  const sendEmailCode = async () => {
    if (!emailForm.newEmail) {
      toast.error('请先输入邮箱地址');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.newEmail)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }

    isSendingEmailCode = true;
    try {
      await api.root.sendCode({ email: emailForm.newEmail, type: 'resetEmail' });
      toast.success('验证码已发送到邮箱');
    } finally {
      isSendingEmailCode = false;
    }
  };

  // 更新邮箱
  const updateEmail = async () => {
    if (!validateEmailForm()) return;

    isUpdatingEmail = true;
    try {
      await api.me.resetEmail({
        email: emailForm.newEmail,
        code: emailForm.verificationCode,
      });
      await me.sync();
      emailForm = { newEmail: '', verificationCode: '' };
      toast.success('邮箱更新成功');
    }finally {
      isUpdatingEmail = false;
    }
  };
</script>

<div class="space-y-8">
  <!-- 修改密码 -->
  <div class="border-b border-gray-200 pb-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">{$me.hasPwd ? '修改密码' : '设置密码'}</h3>
    <div class="space-y-4">
      {#if $me.hasPwd}
        <div class="flex items-center space-x-4">
          <Label for="oldPassword" class="w-12 flex-shrink-0">旧密码</Label>
          <div class="flex-1">
            <Input id="oldPassword" type="password" bind:value={passwordForm.oldPassword} placeholder="请输入旧密码" />
            {#if passwordErrors.oldPassword}
              <p class="text-red-500 text-sm mt-1">{passwordErrors.oldPassword}</p>
            {/if}
          </div>
        </div>
      {/if}

      <div class="flex items-center space-x-4">
        <Label for="newPassword" class="w-12 flex-shrink-0">新密码</Label>
        <div class="flex-1">
          <Input id="newPassword" type="password" bind:value={passwordForm.newPassword} placeholder="请输入新密码" />{#if passwordErrors.newPassword}
            <p class="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
          {/if}
        </div>
      </div>

      <div class="flex justify-end">
        <Button onclick={updatePassword} disabled={isUpdatingPassword}>
          {isUpdatingPassword ? ($me.hasPwd ? '修改中...' : '设置中...') : '保存'}
        </Button>
      </div>
    </div>
  </div>

  <!-- 邮箱设置 -->
  <div class="border-b border-gray-200 pb-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">邮箱设置</h3>
    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <Label for="newEmail" class="w-12 flex-shrink-0">新邮箱</Label>
        <div class="flex-1">
          <Input id="newEmail" type="email" bind:value={emailForm.newEmail} placeholder="请输入新的邮箱地址" />
          {#if emailErrors.newEmail}
            <p class="text-red-500 text-sm mt-1">{emailErrors.newEmail}</p>
          {/if}
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <Label for="emailCode" class="w-12 flex-shrink-0">验证码</Label>
        <div class="flex-1">
          <div class="flex space-x-2">
            <Input id="emailCode" bind:value={emailForm.verificationCode} placeholder="请输入验证码" class="flex-1" />
            <Button color="light" onclick={sendEmailCode} disabled={isSendingEmailCode}>
              {isSendingEmailCode ? '发送中...' : '发验证码'}
            </Button>
          </div>
          {#if emailErrors.verificationCode}
            <p class="text-red-500 text-sm mt-1">{emailErrors.verificationCode}</p>
          {/if}
        </div>
      </div>

      <div class="flex justify-end">
        <Button onclick={updateEmail} disabled={isUpdatingEmail}>
          {isUpdatingEmail ? '更新中...' : '保存'}
        </Button>
      </div>
    </div>
  </div>

  <!-- 手机号设置 -->
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-4">注销账号</h3>
    <div class="space-y-4">
      注销账号后，账号信息被永久删除且无法恢复，请谨慎操作。

      <div class="flex justify-end">
        <Button disabled={isUpdatingPhone}>
          {isUpdatingPhone ? '更新中...' : '确定'}
        </Button>
      </div>
    </div>
  </div>
</div>
