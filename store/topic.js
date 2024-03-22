/**
 * @file 分类数据状态 / ES module
 * @module store/category
 * @author Ronger <https://github.com/ronger-x>
 */

export const TOPIC_API_PATH = '/api/topic'
export const ADMIN_API_PATH = '/api/admin'

const getDefaultListData = () => {
  return {
    topics: [],
    pagination: {}
  }
}
const getDefaultTagsData = () => {
  return {
    tags: [],
    pagination: {}
  }
}

const getDefaultData = () => {
  return {
    topicTitle: '',
    topicIconPath: '',
    topicDescription: '',
    topicNva: '0',
    topicStatus: '0',
    topicTagCount: 0,
    topicSort: 10
  }
}

export const state = () => {
  return {
    fetching: false,
    data: [],
    list: {
      fetching: false,
      data: getDefaultListData()
    },
    detail: {
      fetching: false,
      data: {}
    },
    tags: {
      fetching: false,
      data: getDefaultTagsData()
    }
  }
}

export const mutations = {
  updateListFetching(state, action) {
    state.list.fetching = action
  },
  updateListData(state, action) {
    state.list.data = action
  },
  updateFetching(state, action) {
    state.fetching = action
  },
  updateNavData(state, action) {
    state.data = action
  },
  updateDetailFetching(state, action) {
    state.detail.fetching = action
  },
  updateDetailData(state, action) {
    state.detail.data = action
  },
  updateTopicTagsFetching(state, action) {
    state.tags.fetching = action
  },
  updateTopicTagsData(state, action) {
    state.tags.data = action
  }
}

export const actions = {
  fetchList({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
    // 清空已有数据
    commit('updateListData', getDefaultListData())
    commit('updateListFetching', true)
    let data = {
      page: params.page || 1
    }

    return this.$axios
      .$get(`${ADMIN_API_PATH}/topics`, {
        params: data
      })
      .then(response => {
        commit('updateListFetching', false);
        commit('updateListData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateListFetching', false);
      });
  },
  fetchNavList({ commit }, params) {
    commit('updateFetching', true);
    return this.$axios
      .$get(`${TOPIC_API_PATH}/topic-nav`)
      .then(response => {
        commit('updateNavData', response)
        commit('updateFetching', false)
      })
      .catch(error => {
        commit('updateFetching', false)
      })
  },
  fetchDetail({ commit }, params) {
    commit('updateDetailFetching', true);
    return this.$axios
      .$get(`${ADMIN_API_PATH}/topic/${params.topic_uri}`)
      .then(response => {
        commit('updateDetailData', response)
        commit('updateDetailFetching', false)
      })
      .catch(error => {
        commit('updateDetailFetching', false)
      })
  },

  // 获取详情
  fetchPostDetail({ commit }, params = {}) {
    if (typeof params.topic_id === 'undefined') {
      commit('updateDetailData', getDefaultData())
      return;
    }
    commit('updateDetailFetching', true)
    // commit('updateDetailData', {})
    return this.$axios
      .$get(`${ADMIN_API_PATH}/topic/detail/${params.topic_id}`)
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
  fetchTopicTags({ commit }, params) {
    commit('updateTopicTagsFetching', true);
    return this.$axios
      .$get(`${ADMIN_API_PATH}/topic/${params.topic_uri}/tags?page=${params.page}`)
      .then(response => {
        commit('updateTopicTagsData', response)
        commit('updateTopicTagsFetching', false)
      })
      .catch(error => {
        commit('updateTopicTagsFetching', false)
      })
  },
  fetchUnBindTags({ commit }, params) {
    commit('updateTopicTagsFetching', true);
    return this.$axios
      .$get(`${ADMIN_API_PATH}/topic/unbind-topic-tags`, {
        params: params
      })
      .then(response => {
        commit('updateTopicTagsData', response)
        commit('updateTopicTagsFetching', false)
      })
      .catch(error => {
        commit('updateTopicTagsFetching', false)
      })
  }
}
