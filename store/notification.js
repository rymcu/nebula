export const NOTIFICATION_API_PATH = '/api/notification'

const getDefaultListData = () => {
  return {
    notifications: [],
    pagination: {}
  }
}

export const state = () => {
  return {
    list: {
      fetching: false,
      data: getDefaultListData()
    },
    updateState: false
  }
}

export const mutations = {
  // 消息列表
  updateListFetching(state, action) {
    state.list.fetching = action
  },
  updateListData(state, action) {
    state.list.data = action
  },
  updateState(state, action) {
    state.updateState = action
  }
}

export const actions = {
  // 获取消息列表
  fetchList({commit, state}, params = {}) {
    // 清空已有数据
    commit('updateListFetching', true)
    // 当前页判断
    let currentData = JSON.parse(JSON.stringify(state)).list.data
    let updateState = state.updateState
    if (!updateState) {
      if (Number(params.page) === currentData?.pageNum) {
        commit('updateListFetching', false)
        return
      }
    }
    commit('updateListData', getDefaultListData())
    let data = {
      page: params.page || 1
    }

    commit('updateState', false)

    return this.$axios
      .$get(`${NOTIFICATION_API_PATH}/all`, {
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
