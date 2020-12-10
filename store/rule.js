export const RULE_API_PATH = '/api/rule'

export const state = () => {
  return {
    currencyRules: {
      fetching: false,
      data: []
    }
  }
}

export const mutations = {
  updateCurrencyRulesFetching(state, action) {
    state.currencyRules.fetching = action
  },
  updateCurrencyRulesData(state, action) {
    state.currencyRules.data = action
  }
}

export const actions = {
  fetchCurrencyRules({commit}, params = {}) {
    // 清空已有数据
    commit('updateCurrencyRulesData', [])
    commit('updateCurrencyRulesFetching', true)

    return this.$axios
      .$get(`${RULE_API_PATH}/currency/list`)
      .then(response => {
        commit('updateCurrencyRulesFetching', false);
        commit('updateCurrencyRulesData', response);
      })
      .catch(error => {
        console.log(error);
        commit('updateCurrencyRulesFetching', false);
      });
  }
}
