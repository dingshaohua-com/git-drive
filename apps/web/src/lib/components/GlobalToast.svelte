<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import CheckCircleSolid from 'flowbite-svelte-icons/CheckCircleSolid.svelte';
  import CloseCircleSolid from 'flowbite-svelte-icons/CloseCircleSolid.svelte';
  import FireOutline from 'flowbite-svelte-icons/FireOutline.svelte';
  import { fly, fade } from 'svelte/transition';

  interface ToastMessage {
    id: number;
    type: 'info' | 'success' | 'error';
    message: string;
    duration?: number;
  }

  const toasts = writable<ToastMessage[]>([]);
  let id = 0;

  function showToast(type: ToastMessage['type'], message: string, duration = 2000) {
    id++;
    const toast: ToastMessage = { id, type, message, duration };
    toasts.update(list => [...list, toast]);
    setTimeout(() => {
      toasts.update(list => list.filter(t => t.id !== toast.id));
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
    if (type === 'success') return 'bg-green-50 text-green-700 border-green-200';
    if (type === 'error') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }
  function getIcon(type: ToastMessage['type']) {
    if (type === 'success') return CheckCircleSolid;
    if (type === 'error') return CloseCircleSolid;
    return FireOutline;
  }
</script>

<style>
  .global-toast-container {
    position: fixed;
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
  }
  .global-toast {
    min-width: 240px;
    max-width: 90vw;
    margin-top: 12px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 1.5px 4px rgba(0,0,0,0.06);
    font-size: 15px;
    font-weight: 500;
    pointer-events: auto;
    display: flex;
    align-items: center;
    padding: 12px 20px 12px 16px;
    border: 1px solid;
    background: white;
    transition: box-shadow 0.2s;
  }
  .global-toast-icon {
    margin-right: 10px;
    font-size: 20px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
</style>

<div class="global-toast-container">
  {#each $toasts as toast (toast.id)}
    <div
      class="global-toast {getColor(toast.type)}"
      in:fly={{ y: -20, duration: 200 }}
      out:fade={{ duration: 200 }}
    >
      <span class="global-toast-icon">
        <svelte:component this={getIcon(toast.type)} class="h-5 w-5" />
      </span>
      <span>{toast.message}</span>
    </div>
  {/each}
</div> 