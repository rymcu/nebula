import {ARTICLE_API_PATH} from "@/store/article";

/**
 * @file 分类数据状态 / ES module
 * @module store/category
 * @author Ronger <https://github.com/ronger-x>
 */

export const ADMIN_API_PATH = '/api/admin'
export const TAG_API_PATH = '/api/tag'

const getDefaultListData = () => {
  return {
    tags: [],
    pagination: {}
  }
}
const getDefaultData = () => {
  return {
    tagIconPath: '',
    tagStatus: '0',
    tagReservation: '0'
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
      data: getDefaultData()
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
  updateDetailFetching(state, action) {
    state.detail.fetching = action
  },
  updateDetailData(state, action) {
    state.detail.data = action
  }
}

export const actions = {
  fetchList({commit}, params = {}) {
    // 清空已有数据
    commit('updateListData', getDefaultListData())
    commit('updateListFetching', true)
    let data = {
      page: params.page || 1
    }

    return this.$axios
      .$get(`${ADMIN_API_PATH}/tags`, {
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
  fetchDetail({ commit }, params) {
    commit('updateFetching', true);
    return this.$axios
      .$get(`${ADMIN_API_PATH}/tag/${params.tag_id}`)
      .then(response => {
        commit('updateDetailData', response)
        commit('updateFetching', false)
      })
      .catch(error => {
        commit('updateFetching', false)
      })
  },

  // 获取详情
  fetchPostDetail({ commit }, params = {}) {
    if (typeof params.tag_id === 'undefined') {
      commit('updateDetailData', getDefaultData())
      return;
    }
    commit('updateDetailFetching', true)
    // commit('updateDetailData', {})
    return this.$axios
      .$get(`${ADMIN_API_PATH}/tag/detail/${params.tag_id}`)
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
