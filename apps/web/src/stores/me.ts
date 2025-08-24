import { writable } from 'svelte/store';
import cloneDeep from 'lodash/cloneDeep';
import { browser } from '$app/environment';
import type { User } from '$/api/model';

// 用户信息类型
export type Me = {
  isLoading: boolean;
  hasPwd: boolean;
} & User;

const initUserVal = {
  id: null,
  nickname: null,
  username: null,
  email: null,
  avatar: null,
  isLoading: false,
  hasPwd: false,
  role: null,
  des: null,
  password: null,
};

// Store状态类型
// 创建 Me store
function createMeStore() {
  // 从localStorage获取初始状态
  const getInitialState = (): Me => {
    if (browser) {
      const meStorage = localStorage.getItem('me');
      return (meStorage && meStorage!=='undefined') ? { ...JSON.parse(meStorage), isLoading: false } : cloneDeep(initUserVal);
    }
    return cloneDeep(initUserVal);
  };

  const { subscribe, update } = writable<Me>(getInitialState());

  return {
    subscribe,
    update: (me: Partial<Me>) => update((state) => ({ ...state, ...me })),
    // 同步用户信息
    sync: async () => {
      update((state) => ({ ...state, isLoading: true }));

      try {
        const res = await api.me.get();
        update((state) => {
          if (browser) localStorage.setItem('me', JSON.stringify(res));
          return { ...state, ...res, isLoading: false };
        });
        return res;
      } catch (error) {
        if (browser) {
          // localStorage.removeItem('token');
          // localStorage.removeItem('loginMe');
        }

        throw error;
      }
    },
  };
}

export const me = createMeStore();
