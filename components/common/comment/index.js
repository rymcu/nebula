/**
 * @file Comment box component / ES module
 * @module components/common/comment
 * @author Ronger <https://github.com/ronger-x>
 */

import Comment from './main'

export const comment = {
  install(Vue) {
    Vue.component('comment-box', Comment)
  }
}

export default comment
