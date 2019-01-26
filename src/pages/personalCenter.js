import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { _AUTO_INFO_, updateUserInfo, uploadHeadImg } from '../Actions';
import CollectionsOrMyProducts from '../components/CollectionsOrMyProducts'
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

class PersonalCenterCom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personalInfo: props.user.userInformation,
      isLogined: props.user.isLogined,
      error: {
        studentId: '',
        name: '',
        realName: '',
        tel: '',
        submit: ''
      },
      putResponse: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeAvatar = this.changeAvatar.bind(this);
    this.toPublish = this.toPublish.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const stateInfo = this.state.personalInfo;
    const propsInfo = nextProps.user.userInformation
    this.setState({
      personalInfo: {
        ...stateInfo,
        ...propsInfo
      }
    })
    if (nextProps.user.updateStatus === 2 && propsInfo.informationCompleted) {
      this.setState({ putResponse: '更新成功, 已可发布商品' })
    } else if (nextProps.user.updateStatus === 2 && !propsInfo.informationCompleted) {
      this.setState({ putResponse: '更新成功, 信息不足发布商品' })
    } else if (nextProps.user.updateStatus === 1) {
      this.setState({ putResponse: '更新失败，账户名已被使用' })
    }
  }
  handleChange(e) {
    const inputValue = e.target.value;
    const value = inputValue.replace(/\s/, '');
    const whichChanged = e.target.name;
    let errorValue = '';
    switch (whichChanged) {
      case 'name':
        if (value === '') {
          errorValue = '请输入账户名'
        }
        break;
      case 'realName':
        if (value && value.length > 4) {
          errorValue = '名字最多5个字符'
        }
        break;
      case 'studentId':
        const idNotNumner = /\D/.test(value)
        if (idNotNumner) {
          errorValue = '学号只能是数字'
        } else if (value.length !== 9) {
          errorValue = '学号为9位数'
        }
        break;
      case 'tel':
        const telNotNumner = /\D/.test(value)
        if (telNotNumner) {
          errorValue = '手机号码只能是数字'
        } else if (value.length !== 11) {
          errorValue = '请输入11位手机号'
        }
        break;
      default:
        break;
    }
    this.setState({
      error: {
        ...this.state.error,
        [whichChanged]: errorValue
      },
      personalInfo: {
        ...this.state.personalInfo,
        [whichChanged]: value
      }
    })
  }
  changeAvatar(e) {
    const file = e.target.files[0];
    if (file) {
      this.props.uploadHeadImg(file);
    }
  }
  handleSubmit() {
    const error = this.state.error;
    const isError = Boolean(error.name || error.studentId || error.tel || error.realName)
    this.setState({
      error: {
        ...this.state.error,
        submit: isError ? "请填写正确的参数" : ''
      }
    })
    if (!isError) {
      this.props.updateUserInfo(this.state.personalInfo)
    }
  }
  toPublish(e) {
    const completed = this.state.personalInfo.informationCompleted;
    if (!completed) {
      Modal.confirm({
        title: "完善信息后方可发布信息",
        icon: <Icon type="info-circle" theme="twoTone" />,
        okText: "确定",
        cancelText: "取消",
        maskClosable: true,
      })
      e.preventDefault();
    }
  }
  render() {
    const state = this.state
    const personalInfo = state.personalInfo
    const error = state.error
    const autoData = localStorage.getItem(_AUTO_INFO_);
    const formItemLayout = {
      style: {
        margin: "auto",
        width: "500px"
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    return (
      <div style={{overflow: "auto", height: "100%"}}>
        {autoData ? ''
          : <Redirect to="/index" />
        }
        <h2>个人中心</h2>
        <div style={{textAlign: "center"}}>
          <div style={{
            display: "inline-block",
            width: "100px", height: "100px", borderRadius: "50% 50%",
            backgroundImage: "url(" + personalInfo.headImg + ")",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}
          >
            <input
              type="file"
              title="单击上传头像"
              style={{ opacity: "0", width: "100%", height: "100%" }}
              accept="image/*"
              name="avatar"
              onChange={this.changeAvatar}
            />
          </div>
          <Form style={{textAlign: "center", paddingLeft: "10px"}}>
            <Form.Item
              required
              {...formItemLayout}
              label="账户名："
            >
              <Input
                type="text"
                name="name"
                value={personalInfo.name}
                onChange={this.handleChange} />
            </Form.Item>
            <span style={{margin: "0", color: "red"}}>{error.name}</span><br/>
            <Form.Item
              required
              {...formItemLayout}
              label="真实名字:"
            >
              <Input
                type="text"
                name="realName"
                value={personalInfo.realName}
                onChange={this.handleChange} />
            </Form.Item>
            <span style={{margin: "0", color: "red"}}>{error.realName}</span><br/>
            <Form.Item
              required
              {...formItemLayout}
              label="学号:"
            >
              <Input
                type="text"
                name="studentId"
                value={personalInfo.studentId}
                onChange={this.handleChange} />
            </Form.Item>
            <span style={{margin: "0", color: "red"}}>{error.studentId}</span><br/>
            <Form.Item
              {...formItemLayout}
              label="年级:"
            >
              <Input
                type="text"
                name="grade"
                value={personalInfo.grade}
                onChange={this.handleChange} />
            </Form.Item>
            <br/>
            <Form.Item
              {...formItemLayout}
              label="宿舍:"
            >
              <Input
                type="text"
                name="department"
                value={personalInfo.department}
                onChange={this.handleChange} />
            </Form.Item>
            <br/>
            <Form.Item
              {...formItemLayout}
              label="手机:"
            >
              <Input
                type="text"
                name="tel"
                value={personalInfo.tel}
                onChange={this.handleChange} />
            </Form.Item>
            <span style={{margin: "0", color: "red"}}>{error.tel}</span><br/>
            <Form.Item
              required
              {...formItemLayout}
              label="微信:"
            >
                <Input
                type="text"
                name="weiChat"
                value={personalInfo.weiChat}
                onChange={this.handleChange} />
            </Form.Item>
            <br/>
            <span><span style={{ color: 'red' }}>*</span> 为发布商品必需信息</span><br />
            <Button onClick={this.handleSubmit} type="primary" >保存</Button>
            <span>{error.submit}</span>
            <span>{state.putResponse}</span>
          </Form>
        </div>
        <div>
          <h3>我的收藏</h3><Link to='/index'>去逛逛</Link><hr />
          {personalInfo.collections.length > 0
            ? <CollectionsOrMyProducts collectionsId={personalInfo.collections} />
            : <div>
              <p>暂无收藏商品</p>
            </div>
          }
          <hr style={{ clear: "both" }} />
        </div>
        <div>
          <h3>我的发布</h3><Link to='/index/publish' onClick={this.toPublish} >发布商品</Link><hr />
          {personalInfo.myProducts && personalInfo.myProducts.length > 0
            ? <CollectionsOrMyProducts myProductsId={personalInfo.myProducts} />
            : <div>
              <p>暂无发布商品</p>
            </div>
          }
          <hr style={{ clear: "both" }} />
        </div>
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
    updateUserInfo: updateData => { dispatch(updateUserInfo(updateData)) },
    uploadHeadImg: headImg => { dispatch(uploadHeadImg(headImg)) }
  }
}
const PersonalCenter = connect(mapStateToProps, mapDispatchToProps)(PersonalCenterCom)
export default PersonalCenter
