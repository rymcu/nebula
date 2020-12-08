export const ANSWER_API_PATH = '/api/answer';

export const state = () => {
  return {
    fetching: false,
    detail: {}
  }
}

export const mutations = {
  // 数据列表
  updateFetching(state, action) {
    state.fetching = action
  },
  updateDetailData(state, action) {
    state.detail = action
  }
}

export const actions = {
  // 获取文章列表
  fetchDetail({commit}, params = {}) {
    // 清空已有数据
    commit('updateDetailData', {});
    commit('updateFetching', true);

    return this.$axios
      .$get(`${ANSWER_API_PATH}/today`)
      .then(response => {
        commit('updateFetching', false);
        commit('updateDetailData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateFetching', false);
      });
  }
}
