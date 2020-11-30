import { isServer } from '~/environment'

const cookieParser = isServer ? require('cookieparser') : undefined

export const state = () => {
  return {
    activeMenu: 'index',
    oauth: null,
    userInfo: null,
    locale: 'zh_CN',
    uploadHeaders: ''
  }
}

export const mutations = {
  setAuth (state, auth) {
    state.oauth = auth
  },
  setUser (state, data) {
    state.userInfo = data
  },
  setActiveMenu (state, activeMenu) {
    state.activeMenu = activeMenu
  },
  setUploadHeaders(state, data){
    state.uploadHeaders = data
  },
  setUserInfo(state, data) {
    state.userInfo.avatarURL = data.avatarUrl;
    state.userInfo.nickname = data.nickname;
    let user = {
      nickname: data.nickname,
      avatarURL: data.avatarUrl
    }
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export const actions = {
  nuxtServerInit(store, {req}) {
    // 初始化时的全局任务
    const userAgent = isServer ? req.headers['user-agent'] : navigator.userAgent
    const browser = {
      versions: function() {
        return {     //移动终端浏览器版本信息
          trident: userAgent.indexOf('Trident') > -1, //IE内核
          presto: userAgent.indexOf('Presto') > -1, //opera内核
          webKit: userAgent.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') == -1, //火狐内核
          mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1, //android终端或uc浏览器
          iPhone: userAgent.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
          iPad: userAgent.indexOf('iPad') > -1, //是否iPad
          webApp: userAgent.indexOf('Safari') == -1 //是否web应用程序，没有头部与底部
        };
      } ()
    }
    if (browser.versions.mobile) {
        // 移动端
        store.commit('global/updateMobileState', true)
    }
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieParser.parse(req.headers.cookie)
      try {
        auth = JSON.parse(parsed.auth)
      } catch (err) {
        // No valid cookie found
        console.log(err);
      }
      store.commit('setAuth', auth)
    }

    const initFetchAppData = [
      // 内容数据
      store.dispatch('topic/fetchNavList'),
      store.dispatch('article/fetchList'),
      store.dispatch('search/fetchList'),
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
