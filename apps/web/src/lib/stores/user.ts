import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// 用户信息类型
export interface User {
  id: string;
  nickname: string;
  email: string;
  avatar?: string;
}

// Store状态类型
// 创建user store
function createUserStore() {
  // 从localStorage获取初始状态
  const getInitialState = (): User => {
    if (browser) {
      const userStorage = localStorage.getItem('user');

      return userStorage ? JSON.parse(userStorage) : {
        id: '',
        nickname: '',
        email: '',
        avatar: ''
      };
    }

    return {
      id: '',
      nickname: '',
      email: '',
      avatar: ''
    };
  };

  const { subscribe, set, update } = writable<User>(getInitialState());

  return {
    subscribe,


    // 登出
    logout: () => {
      // if (browser) {
      //   localStorage.removeItem('token');
      //   localStorage.removeItem('loginUser');
      // }
      // set({ token: null, loginUser: null, isLoading: false });
    },

    // 设置加载状态
    // setLoading: (isLoading: boolean) => {
    //   update(state => ({ ...state, isLoading }));
    // },

    // 同步用户信息
    sync: async () => {
      // update(state => ({ ...state, isLoading: true }));

      try {
        const res = await api.user.me();
        update(state => {
          if (browser) localStorage.setItem('user', JSON.stringify(res));
          return { ...state, ...res };
        });
        return res.data;
      } catch (error) {
        if (browser) {
          localStorage.removeItem('token');
          localStorage.removeItem('loginUser');
        }

        throw error;
      }
    }
  };
}

export const user = createUserStore();
