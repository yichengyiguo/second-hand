import { connect } from 'react-redux'
import ProductList from '../components/ProductList'
import { fetchProducts } from '../Actions'

const mapStateToProps = state => {
  return {
    products: state.products,
    user: state.user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getProducts: findKeys => {dispatch(fetchProducts(findKeys))}
  }
}

const getPrductList = connect(mapStateToProps, mapDispatchToProps)(ProductList)

export default getPrductList
