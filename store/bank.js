export const BANK_API_PATH = '/api/admin/bank'

const getDefaultListData = () => {
  return {
    banks: [],
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
    // 清空已有数据
    commit('updateListData', getDefaultListData())
    commit('updateListFetching', true)
    let data = {
      page: params.page || 1
    }

    return this.$axios
      .$get(`${BANK_API_PATH}/list`, {
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
  }
}

