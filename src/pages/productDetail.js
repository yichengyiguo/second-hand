import React from 'react'
import fetch from 'cross-fetch'
import { API, _AUTO_INFO_, canclePublish, updateCollections } from '../Actions'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'

class ProductDetailCom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      isMine: false,
      collectionStatus: false,
      cancelStatus: false,
      toLogin: false,
      publisherData: {},
      curentImage: '',
    }
    this.canclePublish = this.canclePublish.bind(this)
    this.changeCollection = this.changeCollection.bind(this)
    this.showConfirm = this.showConfirm.bind(this)
    this.setCurentImage = this.setCurentImage.bind(this)
  }
  componentWillMount() {
    const productId = this.props.match.params.id;
    fetch(API + '/product/productId?productId=' + productId)
      .then(res => res.json())
      .then(json => {
        const localUser = JSON.parse(localStorage.getItem(_AUTO_INFO_))
        const myId = localUser && localUser.userId;
        let publisherId = json && json.publisherId;
        const isMine = Boolean(publisherId === myId);
        const collections = this.props.personalInformation.collections;
        let collectionStatus = false;
        if (!isMine) {
          if (collections.indexOf(productId) > -1) {
            collectionStatus = true;
          }
        }
        if(json){
          this.setState({
            product: { ...json },
            curentImage: json.productImg[0],
            isMine,
            collectionStatus,
          })
        }
        fetch(API + '/user/userId?userId=' + publisherId)
          .then(res => res.json())
          .then(json => {
            if (json) {
              this.setState({
                publisherData: {
                  ...this.state.publisherData,
                  ...json
                }
              })
            }
          })
      })
  }
  componentWillReceiveProps(nextProps) {
    const isMine = this.state.isMine;
    const productId = this.state.product._id;
    if (isMine) {
      const newMyProducts = nextProps.personalInformation.myProducts;
      if (productId && newMyProducts.indexOf(productId) === -1) {
        this.setState({ cancelStatus: true })
      }
    } else {
      const collections = nextProps.personalInformation.collections;
      if (productId && collections.indexOf(productId) > -1) {
        this.setState({ collectionStatus: true })
      } else {
        this.setState({ collectionStatus: false })
      }

    }
  }
  canclePublish() {
    const productId = this.state.product._id;
    if (productId) {
      this.props.canclePublish(productId)
    }
  }
  changeCollection() {
    const productId = this.state.product._id;
    const userInformation = this.props.personalInformation;
    let collections = userInformation.collections;
    const collectionStatus = this.state.collectionStatus;
    const localUser = JSON.parse(localStorage.getItem(_AUTO_INFO_))
    if (!localUser) {
      Modal.confirm({
        title: "您还未登陆，不能添加收藏",
        icon: <Icon type="info-circle" theme="twoTone" />,
        content: "点击确认前往登陆",
        okText: "登陆",
        cancelText: "取消",
        maskClosable: true,
        onOk: () => { this.setState({ toLogin: true }) }
      })
    } else {
      if (collectionStatus) {
        collections = collections.filter(collectionId =>
          collectionId !== productId
        )
      } else {
        collections.push(productId)
      }
      this.props.updateCollections(collections)
    }
  }
  showConfirm() {
    Modal.confirm({
      title: "确认要取消发布吗？",
      content: "点击确认将取消发布信息",
      autoFocusButton: "cancel",
      okButtonProps: { type: "ghost" },
      okText: "取消发布",
      cancelText: "不取消",
      cancelButtonProps: { type: "primary" },
      maskClosable: true,
      onOk: this.canclePublish
    })
  }
  setCurentImage(image){
    this.setState({curentImage: image})
  }
  render() {
    const isMine = this.state.isMine;
    const publisherData = this.state.publisherData;
    const product = this.state.product;
    const images = product.productImg;
    let showProducts = '';
    if(images && images.length > 0){
      showProducts = images.map(image =>
        <img
          key={image}
          className="littleShow"
          src={image} alt=""
          onClick={() => this.setCurentImage(image)}/>
      )
    }
    return (
      <div className="productDetail">
        {!product._id ? "没找到该商品"
          : <div className="productDetailContainer">
              <div className="showProducts">
                <div style={{ width: '500px', paddingBottom: '500px',
                  backgroundColor: 'white', position: 'relative'}}>
                  <img src={this.state.curentImage}
                    style=
                      {{
                        objectFit: "contain",
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        left: '0',
                        top: '0'
                      }}
                    alt=""
                  />
                </div>
                {showProducts}
                <h2>{product.productName}</h2>
                <h3>{product.price}</h3>
                <p style={{maxWidth: "400px"}}>{product.description}</p>
                {isMine
                  ? <Button type="primary" onClick={this.showConfirm}>取消发布</Button>
                  : <Button type="primary" onClick={this.changeCollection}>
                    {this.state.collectionStatus === true
                      ? "取消收藏"
                      : "添加收藏"
                    }
                  </Button>
                }
              </div>
              <div className="publisherDetail">
                <h3>发布者信息</h3>
                <p>账户名： {publisherData.name}</p>
                <p>真实姓名： {publisherData.realName}</p>
                <p>学号： {publisherData.studentId}</p>
                <p>年级： {publisherData.grade}</p>
                <p>宿舍： {publisherData.department}</p>
                <p>微信号： {publisherData.weiChat}</p>
                <p>电话号码： {publisherData.tel}</p>
              </div>
            {this.state.cancelStatus
              ? <Redirect to="/index" />
              : ''
            }
            {this.state.toLogin
              ? <Redirect to="/loginAndRegister/login" />
              : ''
            }
          </div>
        }
      </div>
    )
  }
}

const mapStataToProps = state => {
  return {
    personalInformation: state.user.userInformation
  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateCollections: newCollections => { dispatch(updateCollections(newCollections)) },
    canclePublish: productId => { dispatch(canclePublish(productId)) }
  }
}
const ProductDetail = connect(mapStataToProps, mapDispatchToProps)(ProductDetailCom)

export default ProductDetail;
