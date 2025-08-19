<script lang="ts">
    import { Button, Label, Input } from 'flowbite-svelte';
    import { me } from '$/stores/me';
    import toast from '$lib/toast';
    
    // 用户信息
    let userInfo = $state({
        nickname: '',
        username: '',
        email: '',
        phone: '',
        avatar: ''
    });
    
    // 状态管理
    let isUpdatingProfile = $state(false);
    
    // 表单验证错误
    let profileErrors = $state({ nickname: '', username: '' });
    
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
    
    // 初始化
    initUserInfo();
</script>

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
    <div class="flex items-center space-x-4">
        <Label for="nickname" class="w-12 flex-shrink-0">昵称</Label>
        <div class="flex-1">
            <Input id="nickname" bind:value={userInfo.nickname} placeholder="请输入昵称" />
            {#if profileErrors.nickname}
                <p class="text-red-500 text-sm mt-1">{profileErrors.nickname}</p>
            {/if}
        </div>
    </div>
    
    <!-- 用户名 -->
    <div class="flex items-center space-x-4">
        <Label for="username" class="w-12 flex-shrink-0">用户名</Label>
        <div class="flex-1">
            <Input id="username" bind:value={userInfo.username} placeholder="请输入用户名" disabled />
            {#if profileErrors.username}
                <p class="text-red-500 text-sm mt-1">{profileErrors.username}</p>
            {/if}
        </div>
    </div>
    
    <!-- 邮箱 -->
    <div class="flex items-center space-x-4">
        <Label class="w-12 flex-shrink-0">邮箱</Label>
        <div class="flex-1">
            <Input value={userInfo.email} disabled />
        </div>
    </div>
    
    <!-- 手机号 -->
    <div class="flex items-center space-x-4">
        <Label class="w-12 flex-shrink-0">手机号</Label>
        <div class="flex-1">
            <Input value={userInfo.phone || '未设置'} disabled />
        </div>
    </div>
    
    <!-- 保存按钮 -->
    <div class="flex justify-end pt-4">
        <Button onclick={updateProfile} disabled={isUpdatingProfile}>
            {isUpdatingProfile ? '保存中...' : '保存修改'}
        </Button>
    </div>
</div> 