import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// 用户信息类型
export interface Me {
  id: string;
  nickname: string;
  email: string;
  avatar?: string;
  isLoading: boolean;
  username?: string;
}

// Store状态类型
// 创建 Me store
function createMeStore() {
  // 从localStorage获取初始状态
  const getInitialState = (): Me => {
    if (browser) {
      const meStorage = localStorage.getItem('me');

      return meStorage ? {...JSON.parse(meStorage), isLoading: false} : {
        id: '',
        nickname: '',
        username:'',
        email: '',
        avatar: '',
        isLoading: false
      };
    }

    return {
      id: '',
      nickname: '',
      username:'',
      email: '',
      avatar: '',
      isLoading: false
    };
  };

  const { subscribe, set, update } = writable<Me>(getInitialState());

  return {
    subscribe,
    update: (me: Me) => update(state => ({ ...state, ...me })),
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
