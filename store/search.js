export const BASE_API_PATH = '/api/lucene';
const getDefaultArticleListData = () => {
  return {
    articles: [],
    pagination: {}
  }
}
const getDefaultUserListData = () => {
  return {
    users: [],
    pagination: {}
  }
}
const getDefaultPortfolioListData = () => {
  return {
    portfolios: [],
    pagination: {}
  }
}

export const state = () => {
  return {
    fetching: false,
    list: [],
    articles: {
      fetching: false,
      data: getDefaultArticleListData()
    },
    users: {
      fetching: false,
      data: getDefaultUserListData()
    },
    portfolios: {
      fetching: false,
      data: getDefaultPortfolioListData()
    }
  }
}

export const mutations = {
  // 数据列表
  updateListFetching(state, action) {
    state.fetching = action
  },
  updateListData(state, action) {
    state.list = action
  },
  // 数据列表
  updateArticleListFetching(state, action) {
    state.articles.fetching = action
  },
  updateArticleListData(state, action) {
    state.articles.data = action
  },
  // 数据列表
  updateUserListFetching(state, action) {
    state.users.fetching = action
  },
  updateUserListData(state, action) {
    state.users.data = action
  },
  // 数据列表
  updatePortfolioFetching(state, action) {
    state.portfolios.fetching = action
  },
  updatePortfolioListData(state, action) {
    state.portfolios.data = action
  },
}

export const actions = {
  // 获取文章列表
  fetchArticleList({commit}, params = {}) {
    // 清空已有数据
    commit('updateArticleListData', getDefaultArticleListData());
    if (!params.queryString) {
      return false;
    }
    commit('updateArticleListFetching', true);

    return this.$axios
      .$get(`${BASE_API_PATH}/search-article`, {
        params: {
          q: params.queryString,
          page: params.page || 1
        }
      })
      .then(response => {
        commit('updateArticleListFetching', false);
        commit('updateArticleListData', response ? response : getDefaultArticleListData());
      })
      .catch(error => {
        console.log(error);
        commit('updateArticleListFetching', false);
      });
  },
  fetchUserList({commit}, params = {}) {
    // 清空已有数据
    commit('updateUserListData', getDefaultUserListData());
    if (!params.queryString) {
      return false;
    }
    commit('updateUserListFetching', true);

    return this.$axios
      .$get(`${BASE_API_PATH}/search-user`, {
        params: {
          q: params.queryString,
          page: params.page || 1
        }
      })
      .then(response => {
        commit('updateUserListFetching', false);
        commit('updateUserListData', response ? response : getDefaultUserListData());
      })
      .catch(error => {
        console.log(error);
        commit('updateUserListFetching', false);
      });
  },
  fetchPortfolioList({commit}, params = {}) {
    // 清空已有数据
    commit('updatePortfolioListData', getDefaultPortfolioListData());
    if (!params.queryString) {
      return false;
    }
    commit('updatePortfolioFetching', true);

    return this.$axios
      .$get(`${BASE_API_PATH}/search-portfolio`, {
        params: {
          q: params.queryString,
          page: params.page || 1
        }
      })
      .then(response => {
        commit('updatePortfolioFetching', false);
        commit('updatePortfolioListData', response ? response : getDefaultPortfolioListData());
      })
      .catch(error => {
        console.log(error);
        commit('updatePortfolioFetching', false);
      });
  }
}
