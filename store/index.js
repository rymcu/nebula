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
       const initFetchAppData = [
      // 内容数据
      store.dispatch('topic/fetchNavList'),
      store.dispatch('article/fetchList')
    ]

    return Promise.all(initFetchAppData)
  }
}
