export const actions = () => ({
  nuxtServerInit(store, {req}) {
    // 初始化时的全局任务
    const initFetchAppData = [
      // 内容数据
      store.dispatch('article/fetchList')
    ]
    return Promise.all(initFetchAppData)
  }
})
