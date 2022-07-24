import Vue from 'vue';

export const ARTICLE_API_PATH = '/api/article'
export const BASE_API_PATH = '/api/console'

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
    announcements: {
      fetching: false,
      data: getDefaultListData()
    },
    detail: {
      fetching: false,
      data: {}
    },
    topicUri: ''
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
  updateAnnouncementListFetching(state, action) {
    state.announcements.fetching = action
  },
  updateAnnouncementListData(state, action) {
    state.announcements.data = action
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
    state.detail.data = action
  },
  clearDetailData(state, action) {
    state.detail.data = {}
  },
  // 更新文章阅读全文状态
  updateDetailRenderedState(state, action) {
    Vue.set(
      state.detail.data,
      'isRenderedFullContent',
      action == null ? true : action
    )
  },
  updateArticleThumbsUpCount(state, action) {
    state.detail.data.articleThumbsUpCount += action.thumbsUpNumber
  },
  updateArticleSponsorCount(state, action) {
    state.detail.data.articleSponsorCount += action.sponsorNumber
  },
  updateTopicUri(state, action) {
    state.topicUri = action
  }
}

export const actions = {
  // 获取公告列表
  fetchAnnouncementList({commit, state}, params = {}) {
    commit('updateAnnouncementListFetching', true)
    // 清空已有数据
    commit('updateListData', getDefaultListData())
    let data = {
      page: params.page || 1
    }
    return this.$axios
      .$get(`${BASE_API_PATH}/announcements`, {
        params: data
      })
      .then(response => {
        commit('updateAnnouncementListFetching', false);
        commit('updateAnnouncementListData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateAnnouncementListFetching', false);
      });
  },
  // 获取文章列表
  fetchList({commit, state}, params = {}) {
    commit('updateListFetching', true)
    // 当前页判断
    let currentData = JSON.parse(JSON.stringify(state)).list.data
    let topicUri = JSON.parse(JSON.stringify(state)).topicUri
    if (Number(params.page) === currentData.pageNum) {
      if (topicUri && topicUri === params.topic_uri) {
        commit('updateListFetching', false)
        return
      }
    }
    // 清空已有数据
    commit('updateListData', getDefaultListData())
    let data = {
      page: params.page || 1,
      topicUri: params.topic_uri || ''
    }
    return this.$axios
      .$get(`${BASE_API_PATH}/articles`, {
        params: data
      })
      .then(response => {
        commit('updateListFetching', false);
        commit('updateListData', response);
        commit('updateTopicUri', params.topic_uri || '');
      })
      .catch(error => {
        console.log(error);
        commit('updateListFetching', false);
      });
  },
  // 获取文章详情
  fetchDetail({commit, state}, params = {}) {
    // const delay = fetchDelay(
    //   isBrowser
    // )
    // if (isBrowser) {
    //   Vue.nextTick(() => {
    //     window.scrollTo(0, 300);
    //   })
    // }
    commit('updateDetailFetching', true)
    // 当前文章判断
    let currentData = JSON.parse(JSON.stringify(state)).detail.data
    if (Number(params.article_id) === currentData?.idArticle) {
      commit('updateDetailFetching', false)
      return
    }
    // commit('updateDetailData', {})
    return this.$axios
      .$get(`${BASE_API_PATH}/article/${params.article_id}`)
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

  // 获取文章详情
  fetchPostDetail({ commit }, params = {}) {
    // const delay = fetchDelay(
    //   isBrowser
    // )
    // if (isBrowser) {
    //   Vue.nextTick(() => {
    //     window.scrollTo(0, 300);
    //   })
    // }

    if (typeof params.article_id === 'undefined') {
      commit('updateDetailData', getDefaultListData())
      return;
    }
    commit('updateDetailFetching', true)
    // commit('updateDetailData', {})
    return this.$axios
      .$get(`${ARTICLE_API_PATH}/detail/${params.article_id}`)
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
  updateThumbsUpCount({ commit }, params = {}) {
    commit('updateArticleThumbsUpCount', params)
  },
  updateSponsorCount({ commit }, params = {}) {
    commit('updateArticleSponsorCount', params)
  }
}
