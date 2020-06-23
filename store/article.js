import Vue from 'vue';
import { isBrowser } from '~/environment';

export const ARTICLE_API_PATH = '/api/v1/console'

const getDefaultListData = () => {
  return {
    articles: [],
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
    }
  }
}

export const mutations = {
  // 文章列表
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

  // 文章详情
  updateDetailFetching(state, action) {
    state.detail.fetching = action
  },
  updateDetailData(state, action) {
    state.detail.data = action.article
  },

  // 更新文章阅读全文状态
  updateDetailRenderedState(state, action) {
    Vue.set(
      state.detail.data,
      'isRenderedFullContent',
      action == null ? true : action
    )
  }
}

export const actions = {
  // 获取文章列表
  fetchList({commit}, params = {}) {

    // 清空已有数据
    // commit('updateListData', getDefaultListData())
    commit('updateListFetching', true)

    return this.$axios
      .$get(`${ARTICLE_API_PATH}/articles`, {params})
      .then(response => {
        commit('updateListFetching', false)
        commit('updateListData', response.data)
        if (isBrowser) {
          Vue.nextTick(() => {
            window.scrollTo(0,0);
          })
        }
      })
      .catch(error => commit('updateListFetching', false))
  },

  // 获取文章详情
  fetchDetail({ commit }, params = {}) {
    // const delay = fetchDelay(
    //   isBrowser
    // )
    console.log(params)
    if (isBrowser) {
      Vue.nextTick(() => {
        window.scrollTo(0, 300);
      })
    }
    commit('updateDetailFetching', true)
    commit('updateDetailData', {})
    return this.$axios
      .$get(`${ARTICLE_API_PATH}/article/${params.article_id}`)
      .then(response => {
        commit('updateDetailData', response.data)
        commit('updateDetailFetching', false)
        // return new Promise(resolve => {
        //   delay(() => {
        //     resolve(response)
        //   })
        // })
      })
      .catch(error => {
        commit('updateDetailFetching', false)
        return Promise.reject(error)
      })
  }
}
