const publish = (state={status: 0}, action) => {
  switch(action.type){
    case 'SET_PUBLISH_STATUS':
      return Object.assign({}, state, {
        status: action.status
      })
    default:
      return state
  }
}

export default publish
