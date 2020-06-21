import Vue from 'vue';
import { isBrowser } from '~/environment';

const ARTICLE_API_PATH = 'article';

const getDefaultListData = () => {
  return {
    data: [],
    pagination: {
      total: 0,
      currentPage: 0
    }
  }
}
export const state = () => ({
  list: {
    fetching: false,
    data: getDefaultListData()
  },
  detail: {
    fetching: false,
    data: {}
  }
})

export const mutations  = () => ({
  // 文章列表
  updateListFetching(state, action) {
    state.list.fetching = action
  },
  updateListData(state, action) {
    state.list.data = action
  },

  // 文章详情
  updateDetailFetching(state, action) {
    state.detail.fetching = action
  },
  updateDetailData(state, action) {
    state.detail.data = action
  }
})

export const actions  = () => ({
  // 获取文章列表
  fetchList({commit}, params = {}) {
    const isRestart = !params.page || params.page === 1
    const isLoadMore = params.page && params.page > 1
    console.log(isRestart, isLoadMore)
    // 清空已有数据
    isRestart && commit('updateListData', getDefaultListData())
    commit('updateListFetching', true)

    return this.$axios
      .$get(ARTICLE_API_PATH, {params})
      .then(response => {
        commit('updateListFetching', false)
        isLoadMore
          ? commit('updateExistingListData', response.result)
          : commit('updateListData', response.result)
        if (isLoadMore && isBrowser) {
          Vue.nextTick(() => {
            window.scrollTo(0, 0);
          })
        }
      })
      .catch(error => commit('updateListFetching', false))
  }
})
