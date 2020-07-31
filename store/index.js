const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => {
  return {
    activeMenu: 'index',
    oauth: null,
    locale: 'zh_CN'
  }
}

export const mutations = {
  setAuth (state, auth) {
    state.oauth = auth
  },
  setActiveMenu (state, activeMenu) {
    state.activeMenu = activeMenu
  }
}

export const actions = {
  nuxtServerInit(store, {req}) {
    // 初始化时的全局任务
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = JSON.parse(parsed.auth)
      } catch (err) {
        // No valid cookie found
      }
      store.commit('setAuth', auth)
    }
    const initFetchAppData = [
      // 内容数据
      store.dispatch('article/fetchList')
    ]
    return Promise.all(initFetchAppData)
  }
}

export const getters = {
  hasPermissions: (state) => (scenes) => {
    let hasPermissions = false;
    const role = state.oauth?.role
    if (role) {
      switch (scenes) {
        case 'user':
          hasPermissions = role < 5;
          break;
        case 'role':
          hasPermissions = role < 2;
          break;
        case 'topic':
          hasPermissions = role < 3;
          break;
        case 'tag':
          hasPermissions = role < 3;
          break;
        case 'admin':
          hasPermissions = role < 2;
          break;
        case 'blog_admin':
          hasPermissions = role < 3;
          break;
        default:
          hasPermissions = false;
          this.commit('logout');
      }
    }
    return hasPermissions;
  }
}
