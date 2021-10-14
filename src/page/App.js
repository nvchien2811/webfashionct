import React ,{useEffect,useState} from 'react';
import { Layout, Menu,Input,Row,Col,BackTop } from 'antd';
import * as FetchAPI from '../util/fetchApi';
import logo from '../images/Fashion-removebg-preview.png';
import Home from './client/Home';
import MenuProduct from './client/MenuProduct';
import ProductDetails from './client/ProductDetails';
import CategoryProduct from './client/CategoryProduct';
import '../css/App.css';
import {Switch,Route, Link,useHistory,useLocation} from "react-router-dom";
import {HistoryOutlined,PhoneOutlined,ArrowUpOutlined} from '@ant-design/icons';
import {FaUser,FaShoppingCart} from 'react-icons/fa';
import {BiMap} from 'react-icons/bi';
import Account  from './client/Account'; 
import Spinner from '../elements/spinner';
const { Header, Footer,Content} = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

export default function App() {
  const [menu, setmenu] = useState();
  const [top, settop] = useState(true);
  const [showContent, setshowContent] = useState(false);
  const [showModalAccount, setshowModalAccount] = useState(false);
  const history = useHistory();
  const location = useLocation();
  useEffect(()=>{
  
    if(location.pathname === "/home"|| location.pathname ==="/"){
      document.addEventListener('scroll', () => {
        const isTop = window.scrollY < 200;
        settop(isTop);
      });
      getMenu();
      setshowContent(false);  
    }
  },[location])
  const getMenu = async()=>{
    try {
      let item = [];
      const res = await FetchAPI.getAPI("/product/getCategory");
      const res2 = await FetchAPI.getAPI("/product/getProductType");
      res.map((category)=>(
        item.push(
          <SubMenu key={category.slug} title={category.name} onTitleClick={()=>history.push(`/category/id#${category.id}`)}>
              {res2.map((item)=>{
                  if(item.idCategory===category.id){
                    const localmenu = {
                      pathname:`/menuproduct/id#${item.id}`
                    }
                    return(
                      <Menu.Item key={item.slug}>{item.name} <Link to={localmenu}/></Menu.Item>
                    )
                  }   
              })}
          </SubMenu>
        )
      )
      )
      setmenu(item);
      setshowContent(true);
    } catch (error) {
      
    }
  }

  const handleCancel = () => {
    setshowModalAccount(false);
  };
  const Top = ()=>(
      <Row className="top" gutter={[{},{lg:0,md:20,xs:10}]} style={{ paddingBottom:10 }} >
          <Col className="logo" style={{ justifyContent:'center',display:'flex',alignItems:'center' }} xl={12} xs={24}>
            <img src={logo} width='120' height='120' alt="logo"/>
            <span style={{ fontSize:17,color:'gray' }}> Just Beautiful Be Your Style</span>
          </Col>
          <Col style={{ justifyContent:'center',display:'flex' }}  xl={6} xs={24}>
            <div className="btnLogin" style={{ display:'flex',alignItems:'center',color:'gray',fontSize:17,paddingLeft:20 }} onClick={()=>setshowModalAccount(true)}>
              <FaUser /><span style={{ paddingLeft:5 }}>Tài khoản</span>
            </div>
            <Link style={{ display:'flex',alignItems:'center',color:'gray',fontSize:17,paddingLeft:20 }} to={{ pathname:"/" }}>
              <FaShoppingCart/><span style={{ paddingLeft:5 }}>Giỏ hàng</span>
            </Link>
          </Col>
          <Col className="search"  style={{ justifyContent:'center',display:'flex' }}  xl={6} xs={24}>
            <Search placeholder="Nhập tên sản phẩm" enterButton style={{width:'70%'}}/>
          </Col>
      </Row>
  )
  const Navigation = ()=>(
    <Header className="header" style={top ? {width:'100%'}:{position:'fixed',width:'100%',top:0,elevation:10,zIndex:100}}>
      <Menu style={{ justifyContent:'center',alignItems:'center' }} theme="dark" mode="horizontal" defaultSelectedKeys={['1']} >
        <Menu.Item key="1">Trang chủ <Link to={"/home"}/></Menu.Item>
        <SubMenu key="2" title="Sản phẩm">
          {menu}
        </SubMenu>
        <Menu.Item key="3">Giới thiệu</Menu.Item>
        <Menu.Item key="4">Sản phẩm khuyến mãi</Menu.Item>
        <Menu.Item key="5">Bộ sưu tập</Menu.Item>
        <Menu.Item key="6">Chính sách</Menu.Item>
        <Menu.Item key="7">Liên hệ</Menu.Item>
      </Menu>
  </Header>
  )
  const Body = ()=>(
    <Content className="site-layout" >
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/menuproduct">
            <MenuProduct/>
          </Route>
          <Route path="/category">
            <CategoryProduct/>
          </Route>
          <Route path="/product">
            <ProductDetails/>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Content>
  )
  return (
    <div >
      {showContent ? 
       <Layout className="layout">
          <Account visible={showModalAccount} onCancel={handleCancel}/>
          <div className="topbar" >
              <span  style={{ color:'white',alignItems:'center' }}> <BiMap style={{fontSize:20,paddingTop:8}}/> 8 Đặng Văn Ngữ | <HistoryOutlined /> 08:00 - 17:00 | <PhoneOutlined /> 0705982473</span>
          </div>
          {Top()}
          {Navigation()}
          {Body()}
          <Footer style={{ textAlign: 'center',bottom:0,width:'100%' }}>Fashion CT ©2020 Created by CT</Footer>
          <BackTop>
            <div className="back-top">
              <ArrowUpOutlined />
            </div>
          </BackTop>
        </Layout>
        :
        <Spinner spinning={!showContent}/>
      }
     
    </div>
  );
}

