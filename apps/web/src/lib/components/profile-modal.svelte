<script lang="ts">
    import { Modal, Button, Label, Input } from 'flowbite-svelte';
    import { me } from '$lib/stores/me';
    // import { api } from '$lib/api';
    import toast from '$lib/toast';
    
    let { visible = $bindable() } = $props();
    
    let formData = $state({ nickname: '', username: '', avatar: '' });
    let isLoading = $state(false);
    let avatarPreview = $state('');
    let errors = $state({ nickname: '', username: '' });
    
    const handleClose = () => {
        visible = false;
        resetForm();
    };
    
    const resetForm = () => {
        formData = { nickname: '', username: '', avatar: '' };
        avatarPreview = '';
        errors = { nickname: '', username: '' };
    };
    
    const initFormData = () => {
        console.log(112233, $me);
        
        me.subscribe(state => {
            console.log(3334455, $me);
            formData.nickname = state.nickname || '';
            formData.username = state.username || '';
            formData.avatar = state.avatar || '';
            avatarPreview = state.avatar || '';
        })();

        // formData.nickname = $me.nickname || '';
        //     formData.username = $me.username || '';
        //     formData.avatar = $me.avatar || '';
        //     avatarPreview = $me.avatar || '';
    };
    
    const validateForm = () => {
        errors = { nickname: '', username: '' };
        if (!formData.nickname.trim()) errors.nickname = '昵称不能为空';
        if (!formData.username.trim()) errors.username = '用户名不能为空';
        return !errors.nickname && !errors.username;
    };
    
    const uploadAvatar = async (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            toast.error('请选择图片文件');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview = e.target?.result as string;
            formData.avatar = avatarPreview;
        };
        reader.readAsDataURL(file);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        isLoading = true;
        try {
            await api.me.put(formData);
            // me.update({
            //     nickname: formData.nickname,
            //     username: formData.username,
            //     avatar: formData.avatar
            // });
            toast.success('资料更新成功');
            handleClose();
        } catch (error) {
            toast.error('资料更新失败');
        } finally {
            isLoading = false;
        }
    };

    $effect(()=>{
        if (visible) initFormData();
    })
</script>

<Modal bind:open={visible} class="w-11/12 max-w-120" onclose={handleClose}>
    <div class="p-6">
        <form onsubmit={handleSubmit} class="space-y-6">
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
                <input id="avatar-upload" type="file" accept="image/*" class="hidden" onchange={uploadAvatar} />
            </div>
            
            <!-- 昵称 -->
            <div class="flex items-center">
                <Label for="nickname" class="w-16">昵称</Label>
                <Input id="nickname" bind:value={formData.nickname} placeholder="请输入昵称" />
                {#if errors.nickname}
                    <p class="text-red-500 text-sm mt-1">{errors.nickname}</p>
                {/if}
            </div>
            
            <!-- 用户名 -->
            <div class="flex items-center">
                <Label for="username" class="w-16">用户名</Label>
                <Input id="username" bind:value={formData.username} placeholder="请输入用户名" disabled/>
                {#if errors.username}
                    <p class="text-red-500 text-sm mt-1">{errors.username}</p>
                {/if}
            </div>
            
            <!-- 按钮 -->
            <div class="flex justify-end space-x-3 pt-4">
                <Button color="light" onclick={handleClose} disabled={isLoading}>取消</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? '保存中...' : '保存'}
                </Button>
            </div>
        </form>
    </div>
</Modal>
  