import React from 'react'
import {publish} from '../Actions'
import { connect } from 'react-redux'

import Upload from 'antd/lib/upload'
import Icon from 'antd/lib/icon'
import Modal from 'antd/lib/modal'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import InputNumber from 'antd/lib/input-number'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Alert from 'antd/lib/alert'
const { Option } = Select
const { TextArea } = Input

var initState = {
  previewVisible: false,
  previewImage: '',
  fileList: [],
  publishData: {
    productName: '',
    price: 0,
    type: '请选择',
    publisherId: '',
    description: '',
    productImg: [],
  },
  error: {
    productName: {
      error: 'success',
      isValid: false
    },
    price: {
      error: 'success',
      isValid: true
    },
    type: {
      error: 'success',
      isValid: false
    },
    description: {
      error: 'success',
      isValid: false
    },
    productImg:{
      error: '',
      isValid: false
    },
    submit: '',
  }
}
class publishDataCom extends React.Component{
  constructor(props){
    super(props);
    this.state = initState
    this.handleCancle = this.handleCancle.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePreview = this.handlePreview.bind(this)
    this.beforeUpload = this.beforeUpload.bind(this)
    this.valueChange = this.valueChange.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.priceChange = this.priceChange.bind(this)
    this.typeChange = this.typeChange.bind(this)
  }
  componentWillMount(){
    const publisherId = this.props.publisherId;
    this.setState({
      publishData: {
        ...this.state.publishData,
        publisherId: publisherId
      }
    })
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      publishData: {
        ...this.state.publishData,
        publisherId: nextProps.publisherId
      }
    })
    if(nextProps.publishStatus === 2){
      this.setState({
        ...initState,
        publishData: {
          ...initState.publishData,
        publisherId: nextProps.publisherId
        }
      })
    }
  }
  handlePreview = file => {
    this.setState({
      previewVisible: true,
      previewImage: file.url || file.thumbUrl,
    })
  }
  handleChange = ({ fileList }) => this.setState(prevState => {
    var error = {
      error: '',
      isValid: true
    };
    if(fileList.length === 0){
      error = {
        error: '请选择商品图片',
        isValid: false
      };
    }else if(fileList.length > 3){
      error = {
        error: '最多上传3张图片',
        isValid: false
      };
    }
    return {
      fileList,
      error: {
        ...this.state.error,
        productImg: error
      }
    }
  })
  handleCancle = () => this.setState({previewVisible: false})
  beforeUpload(file){
    this.setState(prevState => ({
      fileList: [...prevState.fileList, file]
    }));
    return false;
  }
  valueChange(e){
    const whichChanged = e.target.id;
    const value = e.target.value.trimStart();
    var error = {
      error: 'success',
      isValid: true
    };
    switch(whichChanged){
      case 'productName':
        if(value === ''){
          error = {
            error: 'error',
            isValid: false
          }
        }
        break;
      case 'description':
        if(value === ''){
          error = {
            error: 'error',
            isValid: false
          }
        }
        break;
      default :
        break;
    }
    this.setState(prevState => ({
      publishData: {
        ...prevState.publishData,
        [whichChanged]: value
      },
      error: {
        ...prevState.error,
        [whichChanged]: error
      }
    }))
  }
  priceChange(value){
    var error = {
      error: 'success',
      isValid: true
    };
    if(value < 0 || value === ''){
      error = {
        error: 'error',
        isValid: false
      };
    }
    this.setState({
      publishData:{
        ...this.state.publishData,
        price: value
      },
      error: {
        ...this.state.error,
        price: error
      }
    })
  }
  typeChange(value){
    var error = {
      error: 'success',
      isValid: true
    };
    if(value === '请选择'){
      error = {
        error: 'error',
        isValid: false
      };
    }
    this.setState({
      publishData:{
        ...this.state.publishData,
        type: value
      },
      error: {
        ...this.state.error,
        type: error
      }
    })
  }
  handlePublish(){
    const error = this.state.error;
    var submitError = ''
    if(error.productImg.error){
      submitError = error.productImg.error
    }else if (
      !error.productName.isValid ||
      !error.price.isValid ||
      !error.description.isValid
      ){
      submitError = '输入的参数不正确'
    }else if(!error.type.isValid){
      submitError = '请选择分类'
    }
    this.setState({
      error: {
        ...this.state.error,
        submit: submitError
      }
    })
    if(submitError === ''){
      this.props.publish({
        fileList: this.state.fileList,
        publishData: this.state.publishData
      })
    }
  }
  render(){
    const { previewVisible, previewImage, fileList } = this.state;
    const publishStatus = this.props.publishStatus
    const error = this.state.error;
    const publishData = this.state.publishData;
    const uploadButon = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">上传图片</div>
      </div>
    )
    return (
      <div>
        <Upload
          multiple
          accept="image/*"
          beforeUpload={this.beforeUpload}
          name="files"
          listType='picture-card'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          >
            {fileList.length >= 3 ? '' : uploadButon}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancle}>
            <img alt='预览图片' style={{width: '100%'}} src={previewImage}/>
          </Modal>
        <Form>
          <Form.Item
            label="商品名"
            validateStatus={error.productName.error}
            help="请输入商品名称"
          >
            <Input id="productName" value={publishData.productName} onChange={this.valueChange}/>
          </Form.Item>
          <Form.Item
            label="价格 ￥"
            validateStatus={error.price.error}
            help="价格不能小于0"
          >
            <InputNumber
              onChange={this.priceChange}
              value={publishData.price}
              defaultValue={0}
              step={0.1}
              />
          </Form.Item>
          <Form.Item
            label="分类"
            validateStatus={error.type.error}
            help="请选择商品分类"
          >
            <Select
              defaultValue="请选择"
              value={publishData.type}
              onChange={this.typeChange}
            >
              <Option value="请选择" disabled>请选择</Option>
              <Option value="book">书籍</Option>
              <Option value="clothing">服装</Option>
              <Option value="electric">电子设备</Option>
              <Option value="exercise">体育锻炼</Option>
              <Option value="others">其他...</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="描述"
            validateStatus={error.description.error}
            help="描述一下你的商品"
          >
            <TextArea
              id="description"
              value={publishData.description}
              onChange={this.valueChange}
              placeholder="添加描述"
              />
          </Form.Item>
        </Form>
        <Button
          loading={publishStatus === 1}
          onClick={this.handlePublish}
          type="primary">提交发布
        </Button>
        {publishStatus === 2
          ? <div>
              <Alert type="success" message="发布成功,可继续发布" showIcon/>
            </div>
          : publishStatus === -1 || publishStatus === -2
          ? <Alert type="error" message="发布失败" showIcon/>
          : ''
        }
        {error.submit
          ? <Alert type="error" message={error.submit} showIcon/>
          : ''
        }
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    publish: allData => {dispatch(publish(allData))}
  }
}
const mapStateToProps = state => {
  return {
    publisherId: state.user.userInformation._id,
    publishStatus: state.publish.status
  }
}
const PublishData = connect(mapStateToProps,mapDispatchToProps)(publishDataCom)
export default PublishData
