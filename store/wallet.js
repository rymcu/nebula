export const WALLET_API_PATH = '/api/wallet'

const getDefaultListData = () => {
  return {
    records: [],
    pagination: {}
  }
}

export const state = () => {
  return {
    list: {
      fetching: false,
      data: getDefaultListData()
    },
    detail: {
      fetching: false,
      data: {}
    }
  }
}

export const mutations = {
  // 消费记录列表
  updateListFetching(state, action) {
    state.list.fetching = action
  },
  updateListData(state, action) {
    state.list.data = action
  },
  // 账户详情
  updateDetailFetching(state, action) {
    state.detail.fetching = action
  },
  updateDetailData(state, action) {
    state.detail.data = action
  }
}

export const actions = {
  // 获取账户详情
  fetchDetail({ commit }, params = {}) {
    commit('updateDetailFetching', true)
    console.log(params)
    return this.$axios
      .$get(`${WALLET_API_PATH}/${params.idUser}`, {
        params: {
          type: 3
        }
      })
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
