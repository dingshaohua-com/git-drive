




<script lang="ts">
  import { Toast } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import {FireOutline, CloseCircleSolid, CheckCircleSolid} from 'flowbite-svelte-icons';

  interface ToastMessage {
    type: 'info' | 'success' | 'error';
    message: string;
    duration?: number;
  }

  const toastStore = writable<ToastMessage | null>(null);

  let timer: any = null;

  function showToast(type: ToastMessage['type'], message: string, duration = 2000) {
    toastStore.set({ type, message, duration });
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      toastStore.set(null);
    }, duration);
  }

  // 监听全局事件
  onMount(() => {
    (window as any).toast = {
      info: (msg: string, duration?: number) => showToast('info', msg, duration),
      success: (msg: string, duration?: number) => showToast('success', msg, duration),
      error: (msg: string, duration?: number) => showToast('error', msg, duration),
    };
  });

  function getColor(type: ToastMessage['type']) {
    if (type === 'success') return 'green';
    if (type === 'error') return 'red';
    return 'blue';
  }
  function getIcon(type: ToastMessage['type']) {
    if (type === 'success') return CheckCircleSolid;
    if (type === 'error') return CloseCircleSolid;
    return FireOutline;
  }
</script>

{#if $toastStore}
  <Toast color={getColor($toastStore.type)} class="fixed top-6 right-6 z-[9999]">
    <div class="flex items-center">
      {#if getIcon($toastStore.type)}
        <svelte:component this={getIcon($toastStore.type)} class="h-5 w-5 mr-2" />
      {/if}
      <span>{$toastStore.message}</span>
    </div>
  </Toast>
{/if} 