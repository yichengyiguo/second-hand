import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { register, login, setStatus } from '../Actions'
import Input from 'antd/lib/input'
import Icon from 'antd/lib/icon'
import Button from 'antd/lib/button'

class LoginOrRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        isValid: false,
        value: '',
        error: ''
      },
      password: {
        isValid: false,
        value: '',
        error: ''
      },
      rpassword: {
        isValid: false,
        value: '',
        error: ''
      },
      tips: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this)
    this.handleLogin = this.handleLogin.bind(this);
    this.reset = this.reset.bind(this);
  }
  handleChange(e) {
    const whichIsChanged = e.target.name;
    const value = e.target.value;
    const field = { isValid: true, value, error: '' };
    switch (whichIsChanged) {
      case 'name':
        if (value === '') {
          field.isValid = false;
          field.error = '请输入用户名'
        }
        break;
      case 'password':
        if (value.length < 8) {
          field.isValid = false;
          field.error = '密码最少8个字符'
        }
        break;
      case 'rpassword':
        if (value !== this.state.password.value) {
          field.isValid = false;
        }
        break;
      default: return;
    }
    this.setState({
      [whichIsChanged]: field
    })
  }
  handleRegister(e) {
    e.preventDefault();
    const props = this.props
    const state = this.state;
    if (
      state.name.value === ''
      || state.password.value === ''
      || state.rpassword.value === '') {
      this.setState({ tips: "参数不全" })
    } else if (!state.rpassword.isValid) {
      this.setState({ tips: '密码与确认密码不一致' })
    } else if (!state.name.isValid || !state.password.isValid) {
      this.setState({ tips: '请输入正确的参数' })
    } else {
      const name = state.name.value;
      const password = state.password.value;
      const fetchBody = { name, password }
      props.onRegister(fetchBody)
    }
  }
  handleLogin(e) {
    e.preventDefault();
    const props = this.props;
    const state = this.state;
    if (
      state.name.value === ''
      || state.password.value === '') {
      this.setState({ tips: "参数不全" })
    } else {
      const loginData = {
        name: state.name.value,
        password: state.password.value
      };
      props.onLogin(loginData);
    }
  }
  reset() {
    this.setState({
      name: {
        isValid: false,
        value: '',
        error: ''
      },
      password: {
        isValid: false,
        value: '',
        error: ''
      },
      rpassword: {
        isValid: false,
        value: '',
        error: ''
      },
      tips: ''
    })
    this.props.setStatus(0);
  }
  render() {
    const name = this.state.name;
    const password = this.state.password;
    const rpassword = this.state.rpassword;
    const registerStatus = this.props.user.registerSucced;
    const isLoginIng = this.props.user.isLoginIng;
    const isLogined = this.props.user.isLogined;
    const loginOrRegister = this.props.match.params.loginOrRegister === "register";
    const title = loginOrRegister ? "注册" : "登陆";
    const handleSubmit = loginOrRegister
      ? this.handleRegister
      : this.handleLogin;
    return (
      <div>
        <form onSubmit={handleSubmit} className="loginForm">
          <h2 style={{color: "rgba(0, 0, 0, 0.6)"}}>{title}</h2>
          <Input
            prefix={<Icon type="user"
            style={{ color: 'rgba(0,0,0,.25)' }} />}
            className="loginFormInput"
            type="text"
            value={name.value}
            onChange={this.handleChange}
            name="name"
            placeholder="账户名" />
          <div className="loginErrorContainer">
            <span className="loginError">{name.error}</span><br/>
          </div>
          <Input
            prefix={<Icon type="lock"
            style={{ color: 'rgba(0,0,0,.25)' }} />}
            className="loginFormInput"
            type="password"
            value={password.value}
            name="password"
            onChange={this.handleChange}
            placeholder="密码" />
          {loginOrRegister
            ? <>
              <div className="loginErrorContainer">
                <span className="loginError">{password.error}</span><br/>
              </div>
              <Input
                prefix={<Icon type="lock"
                style={{ color: 'rgba(0,0,0,.25)' }} />}
                className="loginFormInput"
                type="password"
                value={rpassword.value}
                name="rpassword"
                onChange={this.handleChange}
                placeholder="确认密码" />
              <div className="loginErrorContainer">
                <span className="loginError">{rpassword.error}</span><br/>
              </div>
            </>
            : <div className="loginErrorContainer">
                <span className="loginError"></span><br/>
              </div>
          }
          <Button
            type="primary"
            htmlType="submit"
            style={{marginRight: "20px"}}
          >
            {title}
          </Button>
          <Link
            to={loginOrRegister
              ? "/loginAndRegister/login"
              : "/loginAndRegister/register"}
            onClick={this.reset}>
            {loginOrRegister
              ? "去登陆-->"
              : "去注册-->"}
          </Link>
          {isLogined && registerStatus === 2 ?
            <div>
              <span style={{ color: "red" }}>注册成功</span>
              <Redirect to="/index" />
            </div>
            : registerStatus === 1 ?
              <div>
                <span style={{ color: "red" }}>该账户名已注册</span>
              </div>
            : registerStatus === -1 ?
                <div>
                  <span style={{ color: "red" }}>注册失败</span>
                </div>
            : ""}
          {isLogined && isLoginIng === 2 ?
            <div>
              <span style={{ color: "red" }}>登陆成功</span>
              <Redirect to="/index" />
            </div>
            : isLoginIng === 1 ?
              <div>
                <span style={{ color: "red" }}>账户名或密码错误</span>
              </div>
              : ""}
          <div className="loginErrorContainer">
            <span className="loginError">{this.state.tips}</span><br/>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onRegister: body => { dispatch(register(body)) },
    onLogin: body => { dispatch(login(body)) },
    setStatus: status => {dispatch(setStatus(status))}
  }
}
const LoginOrRegisterComponent = connect(mapStateToProps, mapDispatchToProps)(LoginOrRegister)

export default LoginOrRegisterComponent
