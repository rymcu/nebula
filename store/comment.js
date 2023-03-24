/**
 * @file 评论数据状态 / ES module
 * @module store/comment
 * @author Ronger <https://github.com/ronger-x>
 */

export const COMMENT_API_PATH = '/api/article/'
export const LIKE_COMMENT_API_PATH = '/like/comment'

const getDefaultListData = () => {
  return {
    comments: [],
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
  // 请求列表
  updateListFetching(state, action) {
    state.list.fetching = action
  },
  updateListData(state, action) {
    state.list.data = action
  },
  clearListData(state) {
    state.list.data = getDefaultListData()
  },

  // 发布评论
  updatePostFetching(state, action) {
    state.posting = action
  },
  updateListNewItemData(state, action) {
    state.data.pagination.total += 1
    state.data.data.push(action.result)
  },

  // 喜欢某条评论
  updateLikesIncrement(state, action) {
    state.data.data.find(comment => {
      const isMatched = comment.id === action.id
      isMatched && comment.likes++
      return isMatched
    })
  }
}

export const actions = {
  fetchList({ commit, state }, params = {}) {
    // 清空已有数据
    commit('updateListFetching', true)
    let currentData = JSON.parse(JSON.stringify(state)).list.data
    if (Number(params.page) === currentData.pageNum) {
      commit('updateListFetching', false)
      return
    }
    let data = {
      page: params.page || 1
    }
    commit('updateListData', getDefaultListData())

    return this.$axios
      .$get(COMMENT_API_PATH + `${params.post_id}/comments`, {
        params: data
      })
      .then(response => {
        // isDescSort && response.result.data.reverse()
        commit('updateListData', response)
        commit('updateListFetching', false)
      })
      .catch(error => commit('updateListFetching', false))
  },

  // 发布评论
  fetchPostComment({ commit }, comment) {
    commit('updatePostFetching', true)
    return this.$axios
      .$post(COMMENT_API_PATH, comment)
      .then(response => {
        commit('updateListNewItemData', response)
        commit('updatePostFetching', false)
        return Promise.resolve(response)
      })
      .catch(error => {
        commit('updatePostFetching', false)
        return Promise.reject(error)
      })
  },

  // 喜欢评论
  fetchLikeComment({ commit }, comment) {
    return this.$axios
      .$patch(LIKE_COMMENT_API_PATH, { comment_id: comment.id })
      .then(response => {
        commit('updateLikesIncrement', comment)
        return Promise.resolve(response)
      })
  }
}
