import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Icon from 'antd/lib/icon'

class ProductCom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collectionStatus: false
    }
  }
  render() {
    return (
      <Link to={"/index/productDetail/" + this.props.productId} className="product">
        <div className="productImgContainer">
          <img
            className="productImg"
            src={this.props.productImg}
            alt="物品展示" />
        </div>
        <div className="productDescContainer">
          <div className="productDesc">
            <h3 style={{whiteSpace: "normal"}}><b>{this.props.productName}</b></h3>
            <span style={{ color: "red", fontSize: "20px" }} >￥ {this.props.price}</span>
            <p className="description">{this.props.description}</p>
            <div className="collection"><Icon style={{ fontSize: "20px" }} type="heart" theme="twoTone" twoToneColor="red" /></div>
          </div>
        </div>
      </Link>
    )
  }
}

const mapStateToProps = state => {
  return {
    collections: state.user.userInformation.collections
  }
}
const Product = connect(mapStateToProps)(ProductCom)
export default Product
