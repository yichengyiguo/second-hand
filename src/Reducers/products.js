import {
  REQUEST_POSTS,
  RECEIVE_POSTS
} from '../Actions'

const products = (state = { isFetching: false, invalidate: false, total: 0, items: [] }, action) => {
  switch (action.type) {
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_POSTS:
      if(!action.data){
        return
      }
      return Object.assign({}, state, {
        isFetching: false,
        total: action.data.total || 1,
        items: action.data.products || []
      })
    default:
      return state
  }
}

export default products
