import React from 'react';
import GetProductList from '../Containers/getProductList';
import { Route, Switch, Link } from 'react-router-dom';
import ProductDetail from './productDetail';
import LoginStatus from '../components/LoginStatus';
import PersonalCenter from './personalCenter';
import Publish from './publish'

class Home extends React.Component {
  render() {
    return (
      <div>
        <header className="header">
          <h1
            style={{color: "white", margin: "0 50px 0 0", height: "100%"}}
          >welcome</h1>
          <Link className="headerItem" to="/index" >首页</Link>
          <LoginStatus className="headerItem"/>
        </header>
        <div className="content">
          <Switch>
            <Route path="/index/publish" component={Publish} />
            <Route path="/index/productDetail/:id" component={ProductDetail} />
            <Route path="/index/personalCenter" component={PersonalCenter} />
            <Route path="/index" component={GetProductList} />
          </Switch>
        </div>
        <footer>
          <p>北京林业大学二手交易网</p>
        </footer>
      </div>
    )
  }
}

export default Home;
