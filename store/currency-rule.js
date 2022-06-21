export const RULE_API_PATH = '/api/admin/rule/currency'

const getDefaultListData = () => {
  return {
    rules: [],
    pagination: {}
  }
}

export const state = () => {
  return {
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
  }
}

export const actions = {
  fetchList({commit}, params = {}) {
    if (params && params.reset === '0') {
      return true;
    }
    // 清空已有数据
    commit('updateListData', [])
    commit('updateListFetching', true)

    return this.$axios
      .$get(`${RULE_API_PATH}/list`)
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
