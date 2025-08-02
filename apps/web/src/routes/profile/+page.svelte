<script lang="ts">
    import { onMount } from 'svelte';
    import { Card, Button, Label, Input, Tabs, TabItem } from 'flowbite-svelte';
    import { me } from '$lib/stores/me';
    import toast from '$lib/toast';
    
    // 用户信息
    let userInfo = $state({
        nickname: '',
        username: '',
        email: '',
        phone: '',
        avatar: ''
    });
    
    // 密码修改表单
    let passwordForm = $state({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    // 邮箱修改表单
    let emailForm = $state({
        newEmail: '',
        verificationCode: ''
    });
    
    // 手机号修改表单
    let phoneForm = $state({
        newPhone: '',
        verificationCode: ''
    });
    
    // 状态管理
    let isLoading = $state(false);
    let isUpdatingProfile = $state(false);
    let isUpdatingPassword = $state(false);
    let isUpdatingEmail = $state(false);
    let isUpdatingPhone = $state(false);
    let isSendingEmailCode = $state(false);
    let isSendingPhoneCode = $state(false);
    
    // 表单验证错误
    let profileErrors = $state({ nickname: '', username: '' });
    let passwordErrors = $state({ oldPassword: '', newPassword: '', confirmPassword: '' });
    let emailErrors = $state({ newEmail: '', verificationCode: '' });
    let phoneErrors = $state({ newPhone: '', verificationCode: '' });
    
    // 头像预览
    let avatarPreview = $state('');
    
    // 初始化用户信息
    const initUserInfo = () => {
        me.subscribe(state => {
            userInfo.nickname = state.nickname || '';
            userInfo.username = state.username || '';
            userInfo.email = state.email || '';
            userInfo.phone = state.phone || '';
            userInfo.avatar = state.avatar || '';
            avatarPreview = state.avatar || '';
        })();
    };
    
    // 加载用户信息
    const loadUserInfo = async () => {
        isLoading = true;
        try {
            await me.sync();
            initUserInfo();
        } catch (error) {
            toast.error('加载用户信息失败');
        } finally {
            isLoading = false;
        }
    };
    
    // 头像上传
    const uploadAvatar = async (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            toast.error('请选择图片文件');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            toast.error('图片大小不能超过5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview = e.target?.result as string;
            userInfo.avatar = avatarPreview;
        };
        reader.readAsDataURL(file);
    };
    
    // 验证基本资料表单
    const validateProfileForm = () => {
        profileErrors = { nickname: '', username: '' };
        if (!userInfo.nickname.trim()) profileErrors.nickname = '昵称不能为空';
        if (!userInfo.username.trim()) profileErrors.username = '用户名不能为空';
        return !profileErrors.nickname && !profileErrors.username;
    };
    
    // 验证密码表单
    const validatePasswordForm = () => {
        passwordErrors = { oldPassword: '', newPassword: '', confirmPassword: '' };
        if (!passwordForm.oldPassword) passwordErrors.oldPassword = '请输入当前密码';
        if (!passwordForm.newPassword) passwordErrors.newPassword = '请输入新密码';
        else if (passwordForm.newPassword.length < 6) passwordErrors.newPassword = '密码长度不能少于6位';
        if (!passwordForm.confirmPassword) passwordErrors.confirmPassword = '请确认新密码';
        else if (passwordForm.newPassword !== passwordForm.confirmPassword) passwordErrors.confirmPassword = '两次输入的密码不一致';
        return !passwordErrors.oldPassword && !passwordErrors.newPassword && !passwordErrors.confirmPassword;
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
    
    // 验证手机号表单
    const validatePhoneForm = () => {
        phoneErrors = { newPhone: '', verificationCode: '' };
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneForm.newPhone) phoneErrors.newPhone = '请输入新手机号';
        else if (!phoneRegex.test(phoneForm.newPhone)) phoneErrors.newPhone = '请输入有效的手机号';
        if (!phoneForm.verificationCode) phoneErrors.verificationCode = '请输入验证码';
        return !phoneErrors.newPhone && !phoneErrors.verificationCode;
    };
    
    // 更新基本资料
    const updateProfile = async () => {
        if (!validateProfileForm()) return;
        
        isUpdatingProfile = true;
        try {
            await api.me.put({
                nickname: userInfo.nickname,
                username: userInfo.username,
                avatar: userInfo.avatar
            });
            await me.sync();
            toast.success('基本资料更新成功');
        } catch (error) {
            toast.error('基本资料更新失败');
        } finally {
            isUpdatingProfile = false;
        }
    };
    
    // 更新密码
    const updatePassword = async () => {
        if (!validatePasswordForm()) return;
        
        isUpdatingPassword = true;
        try {
            await api.me.put({
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword
            });
            passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
            toast.success('密码修改成功');
        } catch (error) {
            toast.error('密码修改失败');
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
            await api.me.sendEmailCode({ email: emailForm.newEmail });
            toast.success('验证码已发送到邮箱');
        } catch (error) {
            toast.error('验证码发送失败');
        } finally {
            isSendingEmailCode = false;
        }
    };
    
    // 更新邮箱
    const updateEmail = async () => {
        if (!validateEmailForm()) return;
        
        isUpdatingEmail = true;
        try {
            await api.me.put({
                email: emailForm.newEmail,
                emailCode: emailForm.verificationCode
            });
            await me.sync();
            emailForm = { newEmail: '', verificationCode: '' };
            toast.success('邮箱更新成功');
        } catch (error) {
            toast.error('邮箱更新失败');
        } finally {
            isUpdatingEmail = false;
        }
    };
    
    // 发送手机验证码
    const sendPhoneCode = async () => {
        if (!phoneForm.newPhone) {
            toast.error('请先输入手机号');
            return;
        }
        
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phoneForm.newPhone)) {
            toast.error('请输入有效的手机号');
            return;
        }
        
        isSendingPhoneCode = true;
        try {
            await api.me.sendPhoneCode({ phone: phoneForm.newPhone });
            toast.success('验证码已发送到手机');
        } catch (error) {
            toast.error('验证码发送失败');
        } finally {
            isSendingPhoneCode = false;
        }
    };
    
    // 更新手机号
    const updatePhone = async () => {
        if (!validatePhoneForm()) return;
        
        isUpdatingPhone = true;
        try {
            await api.me.put({
                phone: phoneForm.newPhone,
                phoneCode: phoneForm.verificationCode
            });
            await me.sync();
            phoneForm = { newPhone: '', verificationCode: '' };
            toast.success('手机号更新成功');
        } catch (error) {
            toast.error('手机号更新失败');
        } finally {
            isUpdatingPhone = false;
        }
    };
    
    onMount(() => {
        loadUserInfo();
    });
</script>

<svelte:head>
    <title>个人资料 - GitDrive</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">个人资料</h1>
        <p class="text-gray-600 mt-2">管理您的账户信息和设置</p>
    </div>
    
    {#if isLoading}
        <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    {:else}
        <Tabs>
            <!-- 基本资料 -->
            <TabItem open title="基本资料">
                <Card class="mt-6">
                    <div class="space-y-6">
                        <!-- 头像上传 -->
                        <div class="flex flex-col items-center space-y-4">
                            <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                                {#if avatarPreview}
                                    <img src={avatarPreview} alt="头像" class="w-full h-full object-cover" />
                                {:else}
                                    <div class="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                {/if}
                            </div>
                            <div class="flex flex-col items-center space-y-2">
                                <input id="avatar-upload" type="file" accept="image/*" class="hidden" onchange={uploadAvatar} />
                                <Button color="light" size="sm" onclick={() => document.getElementById('avatar-upload')?.click()}>
                                    更换头像
                                </Button>
                                <p class="text-xs text-gray-500">支持 JPG、PNG 格式，大小不超过 5MB</p>
                            </div>
                        </div>
                        
                        <!-- 昵称 -->
                        <div class="space-y-2">
                            <Label for="nickname">昵称</Label>
                            <Input id="nickname" bind:value={userInfo.nickname} placeholder="请输入昵称" />
                            {#if profileErrors.nickname}
                                <p class="text-red-500 text-sm">{profileErrors.nickname}</p>
                            {/if}
                        </div>
                        
                        <!-- 用户名 -->
                        <div class="space-y-2">
                            <Label for="username">用户名</Label>
                            <Input id="username" bind:value={userInfo.username} placeholder="请输入用户名" disabled />
                            {#if profileErrors.username}
                                <p class="text-red-500 text-sm">{profileErrors.username}</p>
                            {/if}
                        </div>
                        
                        <!-- 当前邮箱 -->
                        <div class="space-y-2">
                            <Label>当前邮箱</Label>
                            <Input value={userInfo.email} disabled />
                        </div>
                        
                        <!-- 当前手机号 -->
                        <div class="space-y-2">
                            <Label>当前手机号</Label>
                            <Input value={userInfo.phone || '未设置'} disabled />
                        </div>
                        
                        <!-- 保存按钮 -->
                        <div class="flex justify-end pt-4">
                            <Button onclick={updateProfile} disabled={isUpdatingProfile}>
                                {isUpdatingProfile ? '保存中...' : '保存修改'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </TabItem>
            
            <!-- 修改密码 -->
            <TabItem title="修改密码">
                <Card class="mt-6">
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <Label for="oldPassword">当前密码</Label>
                            <Input id="oldPassword" type="password" bind:value={passwordForm.oldPassword} placeholder="请输入当前密码" />
                            {#if passwordErrors.oldPassword}
                                <p class="text-red-500 text-sm">{passwordErrors.oldPassword}</p>
                            {/if}
                        </div>
                        
                        <div class="space-y-2">
                            <Label for="newPassword">新密码</Label>
                            <Input id="newPassword" type="password" bind:value={passwordForm.newPassword} placeholder="请输入新密码" />
                            {#if passwordErrors.newPassword}
                                <p class="text-red-500 text-sm">{passwordErrors.newPassword}</p>
                            {/if}
                        </div>
                        
                        <div class="space-y-2">
                            <Label for="confirmPassword">确认新密码</Label>
                            <Input id="confirmPassword" type="password" bind:value={passwordForm.confirmPassword} placeholder="请再次输入新密码" />
                            {#if passwordErrors.confirmPassword}
                                <p class="text-red-500 text-sm">{passwordErrors.confirmPassword}</p>
                            {/if}
                        </div>
                        
                        <div class="flex justify-end pt-4">
                            <Button onclick={updatePassword} disabled={isUpdatingPassword}>
                                {isUpdatingPassword ? '修改中...' : '修改密码'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </TabItem>
            
            <!-- 邮箱设置 -->
            <TabItem title="邮箱设置">
                <Card class="mt-6">
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <Label for="newEmail">新邮箱地址</Label>
                            <Input id="newEmail" type="email" bind:value={emailForm.newEmail} placeholder="请输入新的邮箱地址" />
                            {#if emailErrors.newEmail}
                                <p class="text-red-500 text-sm">{emailErrors.newEmail}</p>
                            {/if}
                        </div>
                        
                        <div class="space-y-2">
                            <Label for="emailCode">验证码</Label>
                            <div class="flex space-x-2">
                                <Input id="emailCode" bind:value={emailForm.verificationCode} placeholder="请输入验证码" class="flex-1" />
                                <Button color="light" onclick={sendEmailCode} disabled={isSendingEmailCode}>
                                    {isSendingEmailCode ? '发送中...' : '发送验证码'}
                                </Button>
                            </div>
                            {#if emailErrors.verificationCode}
                                <p class="text-red-500 text-sm">{emailErrors.verificationCode}</p>
                            {/if}
                        </div>
                        
                        <div class="flex justify-end pt-4">
                            <Button onclick={updateEmail} disabled={isUpdatingEmail}>
                                {isUpdatingEmail ? '更新中...' : '更新邮箱'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </TabItem>
            
            <!-- 手机号设置 -->
            <TabItem title="手机号设置">
                <Card class="mt-6">
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <Label for="newPhone">新手机号</Label>
                            <Input id="newPhone" bind:value={phoneForm.newPhone} placeholder="请输入新的手机号" />
                            {#if phoneErrors.newPhone}
                                <p class="text-red-500 text-sm">{phoneErrors.newPhone}</p>
                            {/if}
                        </div>
                        
                        <div class="space-y-2">
                            <Label for="phoneCode">验证码</Label>
                            <div class="flex space-x-2">
                                <Input id="phoneCode" bind:value={phoneForm.verificationCode} placeholder="请输入验证码" class="flex-1" />
                                <Button color="light" onclick={sendPhoneCode} disabled={isSendingPhoneCode}>
                                    {isSendingPhoneCode ? '发送中...' : '发送验证码'}
                                </Button>
                            </div>
                            {#if phoneErrors.verificationCode}
                                <p class="text-red-500 text-sm">{phoneErrors.verificationCode}</p>
                            {/if}
                        </div>
                        
                        <div class="flex justify-end pt-4">
                            <Button onclick={updatePhone} disabled={isUpdatingPhone}>
                                {isUpdatingPhone ? '更新中...' : '更新手机号'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </TabItem>
        </Tabs>
    {/if}
</div>
