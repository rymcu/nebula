/**
 * @file 用户关注用户、粉丝数据 / ES module
 * @module store/category
 * @author Ronger <https://github.com/ronger-x>
 */

export const USER_API_PATH = '/api/user'

export const state = () => {
  return {
    fetching: false,
    followers: {
      users: [],
      pagination: {}
    },
    followings: {
      users: [],
      pagination: {}
    }
  }
}

export const mutations = {
  updateFetching(state, action) {
    state.fetching = action
  },
  updateUserFollowerList(state, action) {
    state.followers = action
  },
  updateUserFollowingList(state, action) {
    state.followings = action
  }
}

export const actions = {
  fetchUserFollowerList(store) {
    const {commit, rootState} = store
    commit('updateFetching', true);
    commit('updateUserFollowerList', {
      users: [],
      pagination: {}
    })
    const userInfo = rootState.userInfo
    if (userInfo == null) {
      return
    }
    let account = userInfo.account
    return this.$axios
      .$get(`${USER_API_PATH}/${account}/followers`)
      .then(response => {
        commit('updateUserFollowerList', response)
        commit('updateFetching', false)
      })
      .catch(error => {
        commit('updateFetching', false)
      })
  },
  fetchUserFollowingList(store) {
    const {commit, rootState} = store
    commit('updateFetching', true);
    commit('updateUserFollowingList', {
      users: [],
      pagination: {}
    })
    const userInfo = rootState.userInfo
    if (userInfo == null) {
      return
    }
    let account = userInfo.account
    return this.$axios
      .$get(`${USER_API_PATH}/${account}/followings`)
      .then(response => {
        commit('updateUserFollowingList', response)
        commit('updateFetching', false)
      })
      .catch(error => {
        commit('updateFetching', false)
      })
  }
}

export const getters = {
  isFollower: (state) => (scenes) => {
    let isFollower = false
    let users = state.followings.users
    for (let i in users) {
      let user = users[i]
      if (user.idUser === scenes) {
        isFollower = true;
        break;
      }
    }
    return isFollower
  }
}
