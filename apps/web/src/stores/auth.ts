import { me as meStore } from '.';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { LoginParams } from '$/api/model';

// 认证状态类型
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 创建认证状态store
function createAuthStore() {
  // 从localStorage获取初始状态
  const getInitialState = (): AuthState => {
    if (browser) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          return {
            token,
            isAuthenticated: !!token,
            isLoading: false,
          };
        } catch (e) {
          console.error('Failed to parse auth from localStorage:', e);
        }
      }
    }
    return {
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
  };

  const { subscribe, set, update } = writable<AuthState>(getInitialState());

  return {
    subscribe,

    // 登录
    login: async (params: LoginParams) => {
      update((state) => ({ ...state, isLoading: true }));
      try {
        const { token, me } = await api.root.login(params);

        meStore.update(me);

        // 只更新token，保持其他状态不变
        update((state) => {
          const authState = {
            ...state,
            token: token,
            isAuthenticated: true, // 如果有token就认为已认证
            isLoading: false,
          };

          if (browser) {
            localStorage.setItem('token', token);
          }

          return authState;
        });
        return token;
      } catch (error) {
        update((state) => ({ ...state, isLoading: false }));
        throw error;
      }
    },

    // 登出
    logout: async (needNotifyServer = true) => {
      if (needNotifyServer) {
        await api.root.logout();
      }

      if (browser) {
        localStorage.clear();
      }

      set({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },

    // 获取当前token
    getToken: () => {
      let currentToken: string | null = null;
      subscribe((state) => {
        currentToken = state.token;
      })();
      return currentToken;
    },

    // 设置加载状态
    setLoading: (isLoading: boolean) => {
      update((state) => ({ ...state, isLoading }));
    },
  };
}

export const auth = createAuthStore();
