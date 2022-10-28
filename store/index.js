import { isServer } from '~/environment'

export const state = () => {
  return {
    activeMenu: 'index',
    oauth: null,
    userInfo: null,
    locale: 'zh_CN',
    uploadHeaders: '',
    fingerprint: ''
  }
}

export const mutations = {
  setActiveMenu (state, activeMenu) {
    state.activeMenu = activeMenu
  },
  setUploadHeaders(state, data){
    state.uploadHeaders = data
  },
  setFingerprint (state, fingerprint) {
    state.fingerprint = fingerprint
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

    const initFetchAppData = [
      // 内容数据
      store.dispatch('topic/fetchNavList'),
      store.dispatch('article/fetchList')
    ]

    return Promise.all(initFetchAppData)
  }
}
