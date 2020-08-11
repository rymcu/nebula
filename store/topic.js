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

export const state = () => {
  return {
    fetching: false,
    data: [],
    list: {
      fetching: false,
      data: getDefaultListData()
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
  }
}
