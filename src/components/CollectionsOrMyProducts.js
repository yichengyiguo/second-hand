import React from 'react'
import fetch from 'cross-fetch'
import { API } from '../Actions'
import { Link } from 'react-router-dom'


class CollectionsOrMyProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      myProducts: []
    }
  }
  componentDidMount() {
    let collectionsId = this.props.collectionsId || [];
    let myProductsId = this.props.myProductsId || [];
    if (myProductsId && myProductsId.length > 0) {
      myProductsId.forEach(myProductId => {
        fetch(API + '/product/productId?productId=' + myProductId)
          .then(res => res.json())
          .then(json => {
            if (json._id) {
              this.setState({
                myProducts: [
                  ...this.state.myProducts,
                  json
                ]
              })
            }
          })
      })
    }
    if (collectionsId.length > 0) {
      collectionsId.forEach(collectionId => {
        fetch(API + '/product/productId?productId=' + collectionId)
          .then(res => res.json())
          .then(json => {
            this.setState({
              collections: [
                ...this.state.collections,
                json
              ]
            })
          })
      })
    }
  }
  render() {
    const state = this.state;
    let data = state.collections.length > 0
      ? state.collections
      : state.myProducts.length > 0
        ? state.myProducts
        : []
    const list = data.map(product =>
      <Link
        className="myCollections"
        to={"/index/productDetail/" + product._id} key={product._id}
      >
        <div
          className="collectionContainer"
          style={{ backgroundImage: "url("+product.productImg[0]+")"}}>
        </div>
        <h3 style={{textOverflow: "ellipsis", overflow: "hidden", width: "150px"}}>
          {product.productName}
        </h3>
      </Link>
    )
    return (
      <div style={{overflow: "auto",whiteSpace: "nowrap"}}>
        {list}
      </div>
    )
  }
}

export default CollectionsOrMyProducts
