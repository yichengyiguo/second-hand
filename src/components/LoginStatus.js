import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import {logout, setInfoFromStorage} from '../Actions'

class LoginStatus extends React.Component {
  constructor(props){
    super(props);
    this.state = {isLogout: false}
    this.logout = this.logout.bind(this)
  }
  componentWillMount(){
    const status = localStorage.getItem('_AUTO_INFO_');
    if(status){
      const storageInfo = {
        userId: JSON.parse(status).userId,
        isLogined: JSON.parse(status).isLogined,
        token: JSON.parse(status).token,
      }
      this.props.setInfoFromStorage(storageInfo)
    }
  }
  logout(e){
    e.preventDefault()
    this.props.logout()
    this.setState({isLogout: true})
  }
  render() {
    const user = this.props.user
    if (user.isLogined) {
      return (
        <div>
          {this.state.isLogout ?
            <Redirect to="/index"/>
            : ''
          }
          <Link className="loginStatus" to="/index/personalCenter">个人中心</Link>
          <Link className="loginStatus" to="" onClick={this.logout}>退出</Link>
        </div>
      )
    } else {
      return (
        <div>
          <Link className="loginStatus" to="/loginAndRegister/login">登陆</Link>
          <Link className="loginStatus" to="/loginAndRegister/register">注册</Link>
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    logout: () => {dispatch(logout())},
    setInfoFromStorage: storageInfo => {dispatch(setInfoFromStorage(storageInfo))}
  }
}
const loginStatusComponent = connect(mapStateToProps, mapDispatchToProps)(LoginStatus)

export default loginStatusComponent
