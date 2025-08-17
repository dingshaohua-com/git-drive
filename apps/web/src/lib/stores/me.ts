import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '$lib/api/model/user'

// 用户信息类型
export type Me = {
  isLoading: boolean;
  hasPwd: boolean;
} & User

// Store状态类型
// 创建 Me store
function createMeStore() {
  // 从localStorage获取初始状态
  const getInitialState = (): Me => {
    if (browser) {
      const meStorage = localStorage.getItem('me');

      return meStorage ? { ...JSON.parse(meStorage), isLoading: false } : {
        id: 0,
        nickname: '',
        username: '',
        email: '',
        avatar: '',
        isLoading: false,
        hasPwd: false,
        role: '',
        des: ''
      };
    }

    return {
      id: 0,
      nickname: '',
      username: '',
      email: '',
      avatar: '',
      isLoading: false,
      hasPwd: false
    };
  };

  const { subscribe, set, update } = writable<Me>(getInitialState());

  return {
    subscribe,
    update: (me: Partial<Me>) => update(state => ({ ...state, ...me })),
    // 同步用户信息
    sync: async () => {
      update(state => ({ ...state, isLoading: true }));

      try {
        const res = await api.me.get();
        update(state => {
          if (browser) localStorage.setItem('me', JSON.stringify(res));
          return { ...state, ...res, isLoading: false };
        });
        return res.data;
      } catch (error) {
        if (browser) {
          // localStorage.removeItem('token');
          // localStorage.removeItem('loginMe');
        }

        throw error;
      }
    }
  };
}

export const me = createMeStore();
