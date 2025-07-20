<script lang="ts">
  import '../app.css';
  import AuthGuard from '@/lib/components/auth-guard.svelte';
  import '$lib/api';

  // // 初始化API配置
  // onMount(() => {
  //   // 这里可以执行任何需要在客户端初始化的代码
  //   console.log('应用已初始化,如果需要，可以在这里初始化用户状态');
  // });
</script>

<AuthGuard>
  <slot />
</AuthGuard>