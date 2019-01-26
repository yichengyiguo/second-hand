import fetch from 'cross-fetch'
export const API = 'http://118.24.109.19:8000'
export const _AUTO_INFO_ = '_AUTO_INFO_'

export const setInfoFromStorage = storageInfo => {
  return dispatch => {
    if (storageInfo.userId) {
      return fetch(API + '/user/userId?userId=' + storageInfo.userId)  //之后可带上token
        .then(res => res.json())
        .then(json => {
          if (json._id) {
            dispatch(setUserInformation(json))
            dispatch(setStorage(storageInfo))
          }
          else {
            dispatch(logout());
          }
        })
    }
  }
}
const setStorage = storageInfo => {
  return {
    type: 'SET_AUTO_INFO',
    storageInfo
  }
}
export const logout = () => {
  if (localStorage.getItem(_AUTO_INFO_)) {
    localStorage.clear()
  }
  return dispatch => {
    dispatch(clearData())
  }
}
const clearData = () => {
  return {
    type: 'CLEAR_DATA'
  }
}
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export function requestPosts() {
  return {
    type: REQUEST_POSTS,
  }
}
export function receivePosts(data) {
  return {
    type: RECEIVE_POSTS,
    data
  }
}
export const fetchProducts = findKeys => {
  return dispatch => {
    dispatch(requestPosts())
    return fetch(API + '/product?page=' + findKeys.page + '&pageSize=' +
      findKeys.pageSize + '&filter=' + findKeys.filter + '&searchKey=' + findKeys.searchKey)
      .then(response => response.json())
      .then(json => {
        dispatch(receivePosts(json))
      })
  }
}

const setUserInformation = data => ({
  type: 'SET_USER_INFORMATION',
  data
})
const registerSucced = status => ({
  type: 'REGISTER_SUCCED',
  status
})
export const register = (fetchBody) => {
  return dispatch => {
    return fetch(API + '/register', {
      method: 'POST',
      body: JSON.stringify(fetchBody),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.userInfo) {
          localStorage.setItem(_AUTO_INFO_, JSON.stringify({
            userId: json.userInfo._id, isLogined: true, token: json.token
          }))
          const storageInfo = JSON.parse(localStorage.getItem(_AUTO_INFO_))
          dispatch(setInfoFromStorage(storageInfo));
          dispatch(registerSucced(2))
        } else if (json.nameError) {
          dispatch(registerSucced(1));
        } else {
          dispatch(registerSucced(-1))  //2: 注册成功 1：账户名重复 0:未进行注册操作  -1：注册失败
        }
      })
  }
}

export const setStatus = status => {
  return dispatch => {
    dispatch(setLoginStatus(status));
    dispatch(registerSucced(status));
  }
}
const setLoginStatus = status => {
  return {
    type: "SET_LOGIN_STATUS",
    status
  }
}
export const login = (loginData) => {
  const name = loginData.name;
  const password = loginData.password;
  return dispatch => {
    return fetch(API + '/login?name=' + name + '&password=' + password)
      .then(res => res.json())
      .then(json => {
        if (json.userInfo) {
          localStorage.setItem(_AUTO_INFO_, JSON.stringify({
            userId: json.userInfo._id, isLogined: true, token: json.token
          }))
          const storageInfo = JSON.parse(localStorage.getItem(_AUTO_INFO_))
          dispatch(setInfoFromStorage(storageInfo));
          dispatch(setLoginStatus(2))
        } else {
          dispatch(setLoginStatus(1));    //2: 登陆  1： 登陆失败  0： 未进行登陆操作
        }
      })
  }
}
const setUpdateStatus = status => {
  return {
    type: 'SET_UPDATE_STATUS',
    status
  }
}
export const updateUserInfo = updateData => {
  return dispatch => {
    return fetch(API + '/personalInformation', {    //之后应加上token验证
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })
    .then(res => res.json())
    .then(json => {
      if(json._id){
        dispatch(setUserInformation(json))
        dispatch(setUpdateStatus(2))
      }else{
        dispatch(setUpdateStatus(1))
      }
    })
  }
}

const setPublishStatus = status => ({
  type: 'SET_PUBLISH_STATUS',
  status
})
const addMyProducts = productId => ({
  type: 'ADD_MY_PRODUCTS',
  productId
})
const upload = uploadData => {
  return dispatch => {
    const formData = new FormData();
    uploadData.images.forEach(file => {
      formData.append('files', file.originFileObj)
    });
    return fetch(API + '/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(json => {
      if(json.productImg && json.productImg.length > 0){
        const updateData = {
          productId: uploadData.productId,
          productImg: json.productImg
        }
        fetch(API + '/product/update', {
          method: 'PUT',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(updateData)
        })
        .then(res => res.json())
        .then(json => {
          if(json._id){
            dispatch(addMyProducts(json._id))
            dispatch(setPublishStatus(2))
          }else{
            dispatch(setPublishStatus(-1)) // -2: 发布失败，上传信息错误
          }                                // -1：发布失败，上传图片错误
        })                                 //  0：初始状态
      }                                    //  1：发布中...
    })                                     //  2: 发布成功
  }
}
export const publish = publishData => {
  return dispatch => {
    const images = publishData.fileList;
    const others = publishData.publishData;
    dispatch(setPublishStatus(1))
    fetch(API + '/product/publish', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(others)
    })
    .then(res => res.json())
    .then(json => {
      if(json._id){
        dispatch(upload({
          images,
          productId: json._id
        }))
      }else{
        dispatch(setPublishStatus(-2))
      }
    })
  }
}

const updateStateCollections = collections => ({
  type: "UPDATE_STATE_COLLECTIONS",
  collections
})
export const updateCollections = collections => {
  return dispatch => {
    const data = {
      userId: JSON.parse(localStorage.getItem(_AUTO_INFO_)).userId,
      collections,
    }
    return fetch(API + '/updateCollections', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      if(json){
        console.log(json)
        dispatch(updateStateCollections(json.collections))
      }
    })
  }
}
const updateStateMyProducts = myProducts => ({
  type: 'UPDATE_STATE_MY_PRODUCTS',
  myProducts
})
export const updateMyProducts = myProducts => {
  return dispatch => {
    const data = {
      userId: JSON.parse(localStorage.getItem(_AUTO_INFO_)).userId,
      myProducts,
    }
    return fetch(API + '/updateMyProducts', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      if(json){
        dispatch(updateStateMyProducts(json.myProducts))
      }
    })
  }
}
export const canclePublish = productId => {
  return dispatch => {
    return fetch(API + '/product/delete', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({productId})
    })
    .then(res => res.json())
    .then(json => {
      if(json && json.myProducts){
        dispatch(updateStateMyProducts(json.myProducts))
      }
    })
  }
}

const setHeadImg = headImg => ({
  type: 'SET_HEAD_IMG',
  headImg
})
export const uploadHeadImg = headImg => {
  return dispatch => {
    const formData = new FormData();
    const localUser = JSON.parse(localStorage.getItem(_AUTO_INFO_));
    const userId = localUser && localUser.userId;
    formData.append('avatar', headImg);
    fetch(API + '/upload/headImg?userId=' + userId, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(json => {
      if(json && json.headImg){
        dispatch(setHeadImg(json.headImg))
      }else{
        console.log(json)
      }
    })
  }
}
