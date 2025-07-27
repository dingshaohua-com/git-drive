<script lang="ts">
  // 局部类型声明
  interface ContextMenuManager {
    activeMenuId: string | null;
    menus: Map<string, () => void>;
    hideAll: () => void;
  }

  let { children, menu } = $props();

  let visible = $state(false);
  let x = $state(0);
  let y = $state(0);
  // svelte-ignore non_reactive_update
    let menuElement: HTMLDivElement;
  
  // 生成唯一ID
  const menuId = Math.random().toString(36).substr(2, 9);
  
  // 全局状态管理
  if (!(globalThis as any).__contextMenuManager) {
    (globalThis as any).__contextMenuManager = {
      activeMenuId: null,
      menus: new Map(),
      hideAll: () => {
        const manager = (globalThis as any).__contextMenuManager;
        if (manager && manager.activeMenuId && manager.menus.has(manager.activeMenuId)) {
          const hideFunction = manager.menus.get(manager.activeMenuId);
          if (hideFunction) {
            hideFunction();
          }
          manager.activeMenuId = null;
        }
      }
    };
    
    // 全局点击监听
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.context-menu') && !target.closest('[data-context-trigger]')) {
        (globalThis as any).__contextMenuManager.hideAll();
      }
    });
  }

  const menuManager = (globalThis as any).__contextMenuManager as ContextMenuManager;
  
  // 注册当前菜单的隐藏函数
  menuManager.menus.set(menuId, () => { visible = false; });

  function showContextMenu(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    // 隐藏其他菜单
    menuManager.hideAll();
    
    // 显示当前菜单
    x = e.clientX;
    y = e.clientY;
    visible = true;
    
    // 设置为活跃菜单
    menuManager.activeMenuId = menuId;
  }

  function hideMenu() {
    visible = false;
    if (menuManager.activeMenuId === menuId) {
      menuManager.activeMenuId = null;
    }
  }
</script>

<div 
  oncontextmenu={showContextMenu}
  data-context-trigger
  class="{visible ? 'context-menu-active' : ''}"
>
  {@render children()}
</div>

{#if visible}
  <div 
    bind:this={menuElement}
    class="context-menu fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-32"
    style="left: {x}px; top: {y}px;"
    onclick={hideMenu}
  >
    {@render menu()}
  </div>
{/if}

<style>
  :global(.context-menu-active) {
    background-color: rgba(59, 130, 246, 0.1) !important;
    border-color: rgba(59, 130, 246, 0.3) !important;
  }
</style>












































