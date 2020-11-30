export const state = () => ({
  theme: 'default',
  isMobile: false,
  // ua
  userAgent: '',
  // 默认语言
  language: 'zh-CN',
})


export const getters = {
  isMobile: state => state.isMobile
}

export const mutations = {
  // 设置是否移动端状态
  updateMobileState(state, action) {
  state.isMobile = action
}
}

export const actions ={

}
