const initialState = {
  isLogined: false,
  registerSucced: 0,
  updateStatus: 0,
  isLoginIng: 0,
  token: '',
  userInformation: {
    name: '',
    realName: '',
    studentId: '',
    grade: '',
    department: '',
    tel: '',
    weiChat: '',
    headImg: '',
    informationCompleted: false,
    collections: [],
    myProducts: [],
    _id: ''
  }
}
const user = (state = initialState, action) => {
  switch (action.type) {
    case 'REGISTER_SUCCED':
      return Object.assign({}, state, {
        registerSucced: action.status
      })
    case 'SET_USER_INFORMATION':
      return Object.assign({}, state, {
        userInformation: { ...action.data }
      })
    case 'SET_LOGIN_STATUS':
      return Object.assign({}, state, {
        isLoginIng: action.status
      })
    case 'SET_AUTO_INFO':
      return Object.assign({}, state, {
        isLogined: action.storageInfo.isLogined,
        token: action.storageInfo.token,
      })
    case 'CLEAR_DATA':
      return Object.assign({}, state, initialState)
    case 'SET_UPDATE_STATUS':
      return Object.assign({}, state, {
        updateStatus: action.status
      })
    case 'ADD_MY_PRODUCTS':
      return Object.assign({}, state, {
        userInformation:{
          ...state.userInformation,
          myProducts: [
            ...state.userInformation.myProducts,
            action.productId
          ]
        }
      })
    case 'UPDATE_STATE_COLLECTIONS':
      return Object.assign({}, state, {
        userInformation:{
          ...state.userInformation,
          collections: action.collections
        }
      })
    case 'UPDATE_STATE_MY_PRODUCTS':
      return Object.assign({}, state, {
        userInformation:{
          ...state.userInformation,
          myProducts: action.myProducts
        }
      })
    case 'SET_HEAD_IMG':
      return Object.assign({}, state, {
        userInformation: {
          ...state.userInformation,
          headImg: action.headImg
        }
      })
    default:
      return state
  }
}

export default user
