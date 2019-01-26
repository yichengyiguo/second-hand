import React from 'react'
import { Link } from 'react-router-dom'
import Product from './Product'
import Pagination from 'antd/lib/pagination'
import Menu from 'antd/lib/menu'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon';

const Search = Input.Search

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 8,
      searchKey: '',
      filter: '',
      headImg: '',
    }
    this.changePage = this.changePage.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toPersonalCenter = this.toPersonalCenter.bind(this)
    this.toPublish = this.toPublish.bind(this)
  }
  changePage(page, pageSize) {
    this.setState({
      page,
      pageSize,
    },
      () => {
        this.props.getProducts(this.state)
      })
  }
  handleFilter(value) {
    this.setState({
      searchKey: '',
      page: 1,
      pageSize: 8,
      filter: value.key === 'all' ? '' : value.key
    },
      () => {
        this.props.getProducts(this.state)
      })
  }
  handleSearch(value) {
    this.setState({
      searchKey: value,
      filter: '',
      page: 1,
      pageSize: 8,
    },
      () => {
        this.props.getProducts(this.state)
      })
  }
  handleChange(e) {
    const value = e.target.value;
    this.setState({ searchKey: value })
  }
  componentWillMount() {
    const headImg = this.props.user.userInformation.headImg;
    this.setState({
      headImg: headImg ? headImg : require("../static/user.png")
    })
    this.props.getProducts(this.state)
  }
  componentWillReceiveProps(nextProps) {
    const headImg = nextProps.user.userInformation.headImg;
    this.setState({
      headImg: headImg ? headImg : require("../static/user.png")
    })
  }
  toPersonalCenter(){
    console.log(this.props.location)
    this.props.history.replace("/index/personalCenter")
  }
  toPublish(e){
    e.preventDefault();
    const user = this.props.user;
    if(user && !user.isLogined){
      Modal.confirm({
        title: "您还未登陆，请先登陆",
        icon: <Icon type="info-circle" theme="twoTone" />,
        content: "点击确认前往登陆",
        okText: "登陆",
        cancelText: "取消",
        maskClosable: true,
        onOk: () => this.props.history.replace("/loginAndRegister/login"),
      })
    }else if(user && !user.userInformation.informationCompleted){
      Modal.confirm({
        title: "完善信息后方可发布信息",
        icon: <Icon type="info-circle" theme="twoTone" />,
        okText: "去完善",
        cancelText: "取消",
        onOk: () => this.props.history.replace("/index/personalCenter"),
        maskClosable: true,
      })
    }else{
      this.props.history.replace("/index/publish")
    }
  }
  render() {
    var list = []
    const user = this.props.user;
    const products = this.props.products
    const total = this.props.products.total
    if (!products.isFetching) {
      if (products.items.length === 0) {
        list = <div>"没有相关商品"</div>
      } else {
        list = this.props.products.items.map(product =>
          <div key={product._id} className="productContainer">
            <Product
              description={product.description}
              productId={product._id}
              productImg={product.productImg[0]}
              productName={product.productName}
              price={product.price} />
          </div>
        )
      }
    } else {
      list = <div>获取中...</div>;
    }
    return (
      <div style={{height: "100%", position: "relative"}}>
        <header className="productListHeader">
          <div className="productListHeaderImg"></div>
          <div className="indexAvatarContainer">
            <div className="indexAvatar"
              onClick = {this.toPersonalCenter}
              style={{ backgroundImage: "url(" + this.state.headImg + ")" }}
            >
            </div>
            {user.isLogined
              ? <div className="avatarWelcome">
                  <p>欢迎！</p>
                  <div>
                    <b>{user.userInformation.name}</b>
                    {!user.userInformation.informationCompleted &&
                    <div>
                      <span>完善信息可发布商品</span>
                      <Link to="/index/personalCenter">[去完善]</Link>
                    </div>
                    }
                  </div>
                </div>
              : <div className="avatarWelcome"><Link to="/loginAndRegister/login">[请登录]</Link></div>
            }
          </div>
          <div className="indexPublishContainer"></div>
          <Link onClick={this.toPublish} className="indexPublish" to=''>发布闲置</Link>
        </header>
        <div className="listRow">
          <div className="listMenu" >
            <Menu
              style={{height: "100%"}}
              theme="dark"
              defaultSelectedKeys={['all']}
              onClick={this.handleFilter}
              selectedKeys={this.state.filter ? [this.state.filter] : ['all']}
            >
              <Menu.ItemGroup title="分类">
                <Menu.Item key='all'>全部</Menu.Item>
                <Menu.Item key='book'>书籍</Menu.Item>
                <Menu.Item key='clothing'>服装</Menu.Item>
                <Menu.Item key='electric'>电子设备</Menu.Item>
                <Menu.Item key='exercise'>体育锻炼</Menu.Item>
                <Menu.Item key='others'>其他...</Menu.Item>
              </Menu.ItemGroup>
            </Menu>
          </div>
          <div className="list">
            <div className="productSearchContainer">
              <Search
                placeholder="搜索..."
                onSearch={(this.handleSearch)}
                value={this.state.searchKey}
                onChange={this.handleChange}
                enterButton
                className="productSearch"
              />
            </div>
            <div className="productListContainer">{list}</div>
            <div className="pagination">
              <Pagination
                showQuickJumper
                defaultCurrent={1}
                current={this.state.page}
                pageSize={this.state.pageSize}
                total={total}
                onChange={this.changePage} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductList
