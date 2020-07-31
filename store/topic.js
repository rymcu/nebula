/**
 * @file 分类数据状态 / ES module
 * @module store/category
 * @author Surmon <https://github.com/surmon-china>
 */

export const TOPIC_API_PATH = '/api/topic'

export const state = () => {
  return {
    fetching: false,
    data: []
  }
}

export const mutations = {
  updateFetching(state, action) {
    state.fetching = action
  },
  updateListData(state, action) {
    state.data = action
  }
}

export const actions = {
  fetchList({ commit }, params) {
    commit('updateFetching', true)
    console.log(params)
    return this.$axios
      .$get(`${TOPIC_API_PATH}/topic-nav`)
      .then(response => {
        commit('updateListData', response)
        commit('updateFetching', false)
      })
      .catch(error => {
        commit('updateFetching', false)
      })
  }
}
