import Vue from 'vue';
import { isBrowser } from '~/environment';

export const BASE_API_PATH = '/api/console'
export const PORTFOLIO_API_PATH = '/api/portfolio'

const getDefaultListData = () => {
  return {
    portfolios: [],
    pagination: {}
  }
}

export const state = () => {
  return {
    list: {
      fetching: false,
      data: getDefaultListData()
    },
    detail: {
      fetching: false,
      data: {}
    },
    articles: {
      articles: [],
      pagination: {}
    },
    unbindArticles: {
      articles: [],
      pagination: {}
    }
  }
}

export const mutations = {
  // 作品集列表
  updateListFetching(state, action) {
    state.list.fetching = action
  },
  updateListData(state, action) {
    state.list.data = action
  },
  updateExistingListData(state, action) {
    state.list.data.data.push(...action.data)
    state.list.data.pagination = action.pagination
  },

  // 作品集详情
  updateDetailFetching(state, action) {
    state.detail.fetching = action
  },
  updateDetailData(state, action) {
    state.detail.data = action
  },
  updateArticleList(state, action) {
    state.articles = action
  },
  updateUnbindArticleList(state, action) {
    state.unbindArticles = action
  },

  // 更新作品集阅读全文状态
  updateDetailRenderedState(state, action) {
    Vue.set(
      state.detail.data,
      'isRenderedFullContent',
      action == null ? true : action
    )
  }
}

export const actions = {
  // 获取作品集列表
  fetchList({commit, state}, params = {}) {

    // 清空已有数据
    commit('updateListFetching', true)
    let currentData = JSON.parse(JSON.stringify(state)).list.data
    if (Number(params.page) === currentData.pageNum) {
      commit('updateListFetching', false)
      return
    }
    let data = {
      page: params.page,
      topicUri: params.topic_uri
    }
    commit('updateListData', getDefaultListData())

    return this.$axios
      .$get(`${BASE_API_PATH}/portfolios`, {
        params: data
      })
      .then(response => {
        commit('updateListFetching', false)
        commit('updateListData', response)
        if (isBrowser) {
          Vue.nextTick(() => {
            window.scrollTo(0,0);
          })
        }
      })
      .catch(error => commit('updateListFetching', false))
  },

  // 获取作品集详情
  fetchDetail({ commit }, params = {}) {
    // const delay = fetchDelay(
    //   isBrowser
    // )
    // if (isBrowser) {
    //   Vue.nextTick(() => {
    //     window.scrollTo(0, 300);
    //   })
    // }
    commit('updateDetailFetching', true)
    // commit('updateDetailData', {})
    return this.$axios
      .$get(`${BASE_API_PATH}/portfolio/${params.portfolio_id}`)
      .then(response => {
        return new Promise(resolve => {
          commit('updateDetailData', response)
          commit('updateDetailFetching', false)
          resolve(response)
          // delay(() => {
          //   resolve(response)
          // })
        })
      })
      .catch(error => {
        commit('updateDetailFetching', false)
        return Promise.reject(error)
      })
  },
  fetchArticleList({commit}, params) {
    commit('updateDetailFetching', true)
    return this.$axios
      .$get(`${BASE_API_PATH}/portfolio/${params.portfolio_id}/articles`, {
        params: {
          page: params.page || 1
        }
      })
      .then(response => {
        commit('updateArticleList', response)
        commit('updateDetailFetching', false)
      })
      .catch(error => {
        commit('updateDetailFetching', false)
      })
  },
  fetchUnBindArticleList({commit}, params) {
    commit('updateDetailFetching', true)
    return this.$axios
      .$get(`${PORTFOLIO_API_PATH}/${params.portfolio_id}/unbind-articles`, {
        params: {
          page: params.page || 1,
          searchText: params.searchText || ''
        }
      })
      .then(response => {
        commit('updateUnbindArticleList', response)
        commit('updateDetailFetching', false)
      })
      .catch(error => {
        commit('updateDetailFetching', false)
      })
  },
  fetchPostDetail({ commit }, params = {}) {
    // const delay = fetchDelay(
    //   isBrowser
    // )
    // if (isBrowser) {
    //   Vue.nextTick(() => {
    //     window.scrollTo(0, 300);
    //   })
    // }

    if (typeof params.portfolio_id === 'undefined') {
      commit('updateDetailData', getDefaultListData())
      return;
    }
    commit('updateDetailFetching', true)
    // commit('updateDetailData', {})
    return this.$axios
      .$get(`${PORTFOLIO_API_PATH}/detail/${params.portfolio_id}`)
      .then(response => {
        return new Promise(resolve => {
          commit('updateDetailData', response)
          commit('updateDetailFetching', false)
          resolve(response)
          // delay(() => {
          //   resolve(response)
          // })
        })
      })
      .catch(error => {
        commit('updateDetailFetching', false)
        return Promise.reject(error)
      })
  }
}
