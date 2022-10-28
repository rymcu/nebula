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
  updateTransactionRecordListFetching(state, action) {
    state.list.fetching = action
  },
  updateTransactionRecordListData(state, action) {
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
  fetchDetail({commit}) {
    commit('updateDetailFetching', true)
    return this.$axios
      .$get(`${WALLET_API_PATH}/detail`)
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
  // 获取账户交易记录
  fetchTransactionRecordList({commit}, params = {}) {
    commit('updateTransactionRecordListFetching', true)
    return this.$axios
      .$get(`${WALLET_API_PATH}/transaction-records`, {
        params: {
          startDate: params.startDate,
          endDate: params.endDate,
          page: params.page || 1
        }
      })
      .then(response => {
        return new Promise(resolve => {
          commit('updateTransactionRecordListData', response)
          commit('updateTransactionRecordListFetching', false)
          resolve(response)
          // delay(() => {
          //   resolve(response)
          // })
        })
      })
      .catch(error => {
        commit('updateTransactionRecordListFetching', false)
        return Promise.reject(error)
      })
  }
}
