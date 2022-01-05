import React,{useEffect,useState,useLayoutEffect} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {Layout,Menu,Image,message} from 'antd';
import logo from '../../images/lo-go.png';
import '../../css/Admin.css'; 
import {Switch,Route, NavLink,useHistory,useLocation} from "react-router-dom";
import HomeAdmin from './HomeAdmin';
import Invoices from './Invoices';
import Inventory from './Inventory';
import AccountManger from './AccountManger';
import SaleManager from './SaleManager';
import BillDetails from './BillDetails';
import AddInventory from './AddInventory';
import ManageProduct from './ManageProduct';
import AddProduct from './AddProduct';
import ManageCategory from './ManageCategory';
import ManageProductType from './ManageProductType';
import NotifyAddProductSucess from './NotifyAddProductSucess';
import ViewReview from './ViewReview';
import { useDispatch } from 'react-redux';
import {updateOverflowX} from '../../redux/reducer/layout.reducer';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BarChartOutlined,
    DropboxOutlined,
    ContainerOutlined,
    UserOutlined,
    PoweroffOutlined,
    ShopOutlined,
    GiftOutlined,
    DatabaseOutlined,
    StarOutlined
} from '@ant-design/icons';
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

export default function Admin(){
    const history = useHistory();
    const [showContent, setshowContent] = useState(false);
    const [collapsed, setcollapsed] = useState(false);
    const [widthColl, setwidthColl] = useState(80);
    const location = useLocation();
    const dispatch = useDispatch();
    const key = "logout";

    useLayoutEffect(() => {
        function updateSize() {
            if(window.innerWidth<700){
                setcollapsed(true);
                setwidthColl(0);
                dispatch(updateOverflowX(true))
            }else{
                setwidthColl(80);
                dispatch(updateOverflowX(false))
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize();
    }, []);

    useEffect(()=>{ 
        document.getElementsByClassName("header-nav")[0].style.display = 'none';
        document.getElementsByClassName("footer")[0].style.display = 'none';
        document.getElementsByClassName("sc-bqiRlB bHmrDE rsc-float-button")[0].style.display = 'none';
    },[])
    useEffect(()=>{
        setshowContent(false);
        const token = localStorage.getItem("token_admin");
        if(token==undefined){
            history.push('/loginadmin')
        }else{
            checkAccountAdmin(token);
        }
    },[])
    const checkAccountAdmin = async(token)=>{
        const data = {"token":token};
        const res = await FetchAPI.postDataAPI("/user/getUser",data);
        if(res.msg){
            if(res.msg.message ==="jwt expired"){
                localStorage.removeItem("token_admin");
                history.push('/loginadmin');
                return false;
            }
        }
        if(res[0].ruler===1){
            setshowContent(true);
            if(location.pathname==="/admin"){
                history.push('/admin/home')
            }
        }else{
            localStorage.removeItem("token_admin");
            history.push('/loginadmin');
        }
    }
    const handleLogout = ()=>{
        message.loading({ content: 'Đang đăng xuất...', key });
        setTimeout(()=>{
            localStorage.removeItem("token_admin");
            message.success({ content: 'Đăng xuất thành công!', key, duration: 2 });
            history.push('/loginadmin');
        },1000)
    }
    const currentMenuKeyInventory = (key)=>{
        console.log(location.pathname.search(key));
        if (location.pathname.search(key) >= 0) {
          return location.pathname;
        }else{
          return "/admin/addInventory"
        }
    }
    const NavMenu = ()=>(
            <Menu 
                theme="dark" 
                mode="inline" 
                defaultSelectedKeys={['/admin/home']} 
                style={{ paddingTop:20 }} 
                selectedKeys={[location.pathname]}
            >
                <Menu.Item key="/admin/home" icon={<BarChartOutlined />}>
                    <NavLink to="/admin/home">
                        Tổng quan
                    </NavLink>
                </Menu.Item>
                <SubMenu key="sub1" icon={<DropboxOutlined />} title="Sản phẩm">
                    <Menu.Item key="/admin/addproduct">
                        <NavLink to="/admin/addproduct">
                            Thêm sản phẩm
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="/admin/manageProduct">
                        <NavLink to="/admin/manageProduct">
                            Sửa, Xóa sản phẩm
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<DatabaseOutlined/>} title="Danh mục">
                    <Menu.Item key="/admin/category">
                        <NavLink to="/admin/category"> 
                            Danh mục sản phẩm
                        </NavLink>
                    </Menu.Item>    
                    <Menu.Item key="/admin/producttype">
                        <NavLink to="/admin/producttype">
                            Loại sản phẩm
                        </NavLink>
                    </Menu.Item> 
                </SubMenu>
                <Menu.Item key="/admin/invoices" icon={<ContainerOutlined />}>
                    <NavLink to="/admin/invoices">
                        Hóa đơn
                    </NavLink>
                </Menu.Item>
                <Menu.Item key={currentMenuKeyInventory("/admin/inventory")} icon={<ShopOutlined />}>
                    <NavLink to="/admin/inventory">
                        Kho hàng
                    </NavLink>    
                </Menu.Item>
                <Menu.Item key="/admin/account" icon={<UserOutlined />}>
                    <NavLink to="/admin/account">
                        Tài khoản
                    </NavLink>    
                </Menu.Item>
                <Menu.Item key="/admin/sale" icon={<GiftOutlined />}>
                    <NavLink to="/admin/sale">
                        Sự kiện ưu đãi
                    </NavLink>    
                </Menu.Item>
                <Menu.Item key="/admin/review" icon={<StarOutlined />}>
                    <NavLink to="/admin/review">
                        Đánh giá sản phẩm
                    </NavLink>    
                </Menu.Item>
                <Menu.Item icon={<PoweroffOutlined />} onClick={handleLogout}>
                    Đăng xuất
                </Menu.Item>
            </Menu>
        )
    const Body = ()=>(
        <Switch>
            <Route path="/admin/home">
                <HomeAdmin />
            </Route>
            <Route path="/admin/invoices">
                <Invoices />
            </Route>
            <Route path="/admin/inventory">
                <Inventory />
            </Route>
            <Route path="/admin/account">
                <AccountManger />
            </Route>
            <Route path="/admin/sale">
                <SaleManager />
            </Route>
            <Route path="/admin/billdetails/:idBill">
                <BillDetails/>
            </Route>
            <Route path="/admin/addInventory">
                <AddInventory />
            </Route>
            <Route path="/admin/manageProduct">
                <ManageProduct />
            </Route>
            <Route path="/admin/addproduct">
                <AddProduct/>
            </Route>
            <Route path="/admin/category">
                <ManageCategory/>
            </Route>
            <Route path="/admin/producttype">
                <ManageProductType/>
            </Route>
            <Route path="/admin/review">
                <ViewReview/>
            </Route>
            <Route path="/admin/notify_add_product">
                <NotifyAddProductSucess />
            </Route>
            <Route path="/admin">
                <HomeAdmin />
            </Route>
        </Switch>
    )
   
    return(
        <div>
        {showContent ?
            <Layout style={{ minHeight:window.innerHeight }}>
            <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={widthColl}>
                <div className="logo" style={{ alignItems:'center',display:'flex',paddingTop:20,flexDirection:'column' }}>
                    <Image src={logo} width={80} preview={false}/>   
                    <span style={{ color:'gray',fontWeight:'bold' }}>Fashion CT</span> 
                </div>
                <NavMenu/>
            </Sider>
             <Layout>
               <Header className="site-layout-background" >
            
                {collapsed ? 
                <MenuUnfoldOutlined  onClick={()=>setcollapsed(!collapsed)}/> 
                : 
                <MenuFoldOutlined  onClick={()=>setcollapsed(!collapsed)}/>
                }
                <span style={{ paddingLeft:20 }}>Fashion CT</span>
            
               </Header>
               <Content  
                    className="site-layout-background"
                    style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    }}>
                {Body()}
                </Content>
    
             </Layout>
           </Layout>
        :
        <Spinner spinning={!showContent}/>
        }
        </div>
    )
}