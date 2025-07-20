<script lang="ts">
  import '../app.css';
  import AuthGuard from '$lib/components/auth-guard.svelte';
</script>

<AuthGuard>
  <slot />
</AuthGuard>