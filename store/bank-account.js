export const BANK_ACCOUNT_API_PATH = '/api/admin/bank-account'

const getDefaultListData = () => {
  return {
    bankAccounts: [],
    pagination: {}
  }
}
const getDefaultTransactionRecordListData = () => {
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
    records: {
      fetching: false,
      data: getDefaultTransactionRecordListData()
    }
  }
}

export const mutations = {
  // 消费记录列表
  updateTransactionRecordListFetching(state, action) {
    state.records.fetching = action
  },
  updateTransactionRecordListData(state, action) {
    state.records.data = action
  },
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
    commit('updateListData', getDefaultListData())
    commit('updateListFetching', true)
    let data = {
      page: params.page || 1
    }

    return this.$axios
      .$get(`${BANK_ACCOUNT_API_PATH}/list`, {
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
  // 获取账户交易记录
  fetchTransactionRecordList({commit}, params = {}) {
    commit('updateTransactionRecordListFetching', true)
    return this.$axios
      .$get(`${BANK_ACCOUNT_API_PATH}/transaction-records`, {
        params: {
          bankAccount: params.bankAccount,
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

