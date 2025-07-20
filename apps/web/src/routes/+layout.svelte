<script lang="ts">
  import '../app.css';
  import AuthGuard from '@/lib/components/auth-guard.svelte';
  import '$lib/api';
  import { onMount } from 'svelte';

  // 页面加载状态
  let isPageReady = $state(false);

  onMount(() => {
    // 页面加载完成后延迟1秒显示内容
    setTimeout(() => {
      isPageReady = true;
    }, 300);
  });
</script>

{#if !isPageReady}
  <!-- 简单的加载遮罩 -->
  <div class="fixed inset-0 bg-white z-50"></div>
{:else}
  <!-- 页面内容缓慢出现动画 -->
  <div class="animate-fade-in">
    <AuthGuard>
      <slot />
    </AuthGuard>
  </div>
{/if}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
</style>