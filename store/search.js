export const BASE_API_PATH = '/api/console';

export const state = () => {
  return {
    fetching: false,
    list: []
  }
}

export const mutations = {
  // 数据列表
  updateListFetching(state, action) {
    state.fetching = action
  },
  updateListData(state, action) {
    state.list = action
  }
}

export const actions = {
  // 获取文章列表
  fetchList({commit}, params = {}) {
    // 清空已有数据
    commit('updateListData', []);
    commit('updateListFetching', true);

    return this.$axios
      .$get(`${BASE_API_PATH}/initial-search`)
      .then(response => {
        commit('updateListFetching', false);
        commit('updateListData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateListFetching', false);
      });
  }
}
