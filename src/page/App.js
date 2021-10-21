import React ,{useEffect,useState} from 'react';
import { Layout, Menu,Input,Row,Col,BackTop, Dropdown,message,Badge } from 'antd';
import * as FetchAPI from '../util/fetchApi';
import logo from '../images/Fashion-removebg-preview.png';
import Home from './client/Home';
import MenuProduct from './client/MenuProduct';
import ProductDetails from './client/ProductDetails';
import CategoryProduct from './client/CategoryProduct';
import Admin from './admin/Admin';
import Account  from './client/Account'; 
import Cart from './client/Cart';
import Payment from './client/Payment';
import BillFollow from './client/BillFollow';
import InfoAccount from '../elements/menuAccount';
import BillDetails from './client/BillDetails';
import DropDownCart from '../elements/dropDownCart';
import '../css/App.css';
import {Switch,Route, Link,useHistory,Redirect} from "react-router-dom";
import {HistoryOutlined,PhoneOutlined,ArrowUpOutlined} from '@ant-design/icons';
import {FaUser,FaShoppingCart} from 'react-icons/fa';
import {BiMap} from 'react-icons/bi';
import { useDispatch,useSelector } from 'react-redux';
import { getUser} from '../util/getUser';
import { updateCartCurrent } from '../contain/updateQuanityCart';
import { updateUser } from '../redux/reducer/user.reducer';
const { Header, Footer,Content} = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

export default function App() {
  const [menu, setmenu] = useState();
  const [top, settop] = useState(true);
  const [showContent, setshowContent] = useState(false);
  const [showModalAccount, setshowModalAccount] = useState(false);
  const [statusUser, setstatusUser] = useState(false);
  const history = useHistory();
  const datauser = useSelector(state=>state.userReducer.currentUser);
  const quanityCart = useSelector(state=>state.productReducer.quanityCart);
  const dataCart = useSelector(state=>state.productReducer.cart);
  const dispatch = useDispatch();

  useEffect(()=>{
    document.addEventListener('scroll', () => {
      const isTop = window.scrollY < 200;
      settop(isTop);
    });
    getMenu();
    setshowContent(false); 
    updateQuanityCart();
    checkUser();
  },[])
  const updateQuanityCart = ()=>{
    updateCartCurrent(dispatch);
  }
 
  const checkUser = async()=>{
    const token = localStorage.getItem("token");
    if(token===undefined||token===null){
      setstatusUser(false)
      dispatch(updateUser({}));
    }
    else{
      setstatusUser(true);
      const status = await getUser(token,dispatch);
      if(status===false){
        message.warning("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !");
        setstatusUser(false);
      }else{
        setstatusUser(true);
      }
    }
  }
  const handleCancel = () => {
    setshowModalAccount(false);
  };

  const getMenu = async()=>{
    try {
      let item = [];
      const res = await FetchAPI.getAPI("/product/getCategory");
      const res2 = await FetchAPI.getAPI("/product/getProductType");
      res.map((category)=>(
        item.push(
          <SubMenu key={category.slug} title={category.name} onTitleClick={()=>history.push(`/category/${category.id}`)}>
              {res2.map((item)=>{
                  if(item.idCategory===category.id){
                    const localmenu = {
                      pathname:`/menuproduct/${item.id}`
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

  const Top = ()=>(
      <Row className="top" gutter={[{},{lg:0,md:20,xs:10}]} style={{ paddingBottom:10 }} >
          <Col className="logo" style={{ justifyContent:'center',display:'flex',alignItems:'center' }} xl={12} xs={24}>
            <img src={logo} width='120' height='120' alt="logo"/>
            <span style={{ fontSize:17,color:'gray' }}> Just Beautiful Be Your Style</span>
          </Col>
          <Col style={{ justifyContent:'center',display:'flex' }}  xl={6} xs={24}>
            {!statusUser ?
            <div 
              className="btnLogin" 
              style={{ display:'flex',alignItems:'center',color:'gray',fontSize:17,paddingLeft:20 }} 
              onClick={()=>setshowModalAccount(true)}
            >
              <FaUser /><span style={{ paddingLeft:5 }}>Đăng nhập</span>
            </div>
            :
            <Dropdown overlay={MenuAccount} placement="bottomLeft" arrow>
            <div 
              className="btnLogin" 
              style={{ display:'flex',alignItems:'center',color:'gray',fontSize:17,paddingLeft:20 }} 
            >
              <FaUser /><span style={{ paddingLeft:5 }}>Tài khoản </span>
            </div>
            </Dropdown>
            }
            <div style={{ display:'flex',flexDirection:'row',alignItems:'center' }}>
            <Link 
              style={{ display:'flex',alignItems:'center',color:'gray',fontSize:17,paddingLeft:20 }} 
              onClick={()=>console.log(datauser)} 
              to={{ pathname:"/cart" }}
            >
                <FaShoppingCart/>
            </Link>
            <Dropdown overlay={Cartdrop} placement="bottomCenter" arrow>
                <Badge count={quanityCart} offset={[5,-10]} >
                <span style={{ paddingLeft:5,fontSize:17,color:'gray',cursor:"pointer" }}>
                  Giỏ hàng
                </span>
                </Badge>
            </Dropdown>
          </div>
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
  const Cartdrop = (
    <DropDownCart
      data={dataCart}
      update={()=>updateQuanityCart()}
    />
  )
  const MenuAccount =(
    <InfoAccount 
      refreshAccount={checkUser} 
      data={datauser}
    /> 
  )
  const Body = ()=>(
    <Content className="site-layout" >
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/menuproduct/:idProductType">
            <MenuProduct/>
          </Route>
          <Route path="/category/:id">
            <CategoryProduct/>
          </Route>
          <Route path="/product/:idProduct">
            <ProductDetails/>
          </Route>
          <Route path="/cart">
            <Cart/>
          </Route>
          <Route path="/payment">
            <Payment />
          </Route>
          <Route path="/billfollow">
            <BillFollow />
          </Route>
          <Route path="/billdetails/:idBill">
            <BillDetails/>
          </Route>
          <Route path="/admin">
            <Admin/>
          </Route>
          <Redirect to="/home" />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Content>
  )
  return (
    <div >
      {showContent &&
       <Layout className="layout">
        <div className="header-nav">
          <Account visible={showModalAccount} onCancel={handleCancel} refeshAccount={checkUser}/>
          <div className="topbar" >
              <span  style={{ color:'white',alignItems:'center' }}> <BiMap style={{fontSize:20,paddingTop:8}}/> 8 Đặng Văn Ngữ | <HistoryOutlined /> 08:00 - 17:00 | <PhoneOutlined /> 0705982473</span>
          </div>
          {Top()}
          {Navigation()}
        </div>
          {Body()}
          <Footer className="footer" style={{ textAlign: 'center',bottom:0,width:'100%' }}>Fashion CT ©2020 Created by CT</Footer>
          <BackTop>
            <div className="back-top">
              <ArrowUpOutlined />
            </div>
          </BackTop>
        </Layout>
      }
    </div>
  );
}

