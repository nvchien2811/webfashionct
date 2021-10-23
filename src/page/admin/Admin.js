import React,{useEffect,useState,useLayoutEffect} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {Layout,Menu,Image,message} from 'antd';
import logo from '../../images/lo-go.png';
import '../../css/Admin.css'; 
import {Switch,Route, Link,useHistory} from "react-router-dom";
import HomeAdmin from './HomeAdmin';
import Invoices from './Invoices';
import Inventory from './Inventory';
import AccountManger from './AccountManger';
import SaleManager from './SaleManager';
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BarChartOutlined,
    DropboxOutlined,
    ContainerOutlined,
    UserOutlined,
    PoweroffOutlined,
    ShopOutlined,
    GiftOutlined
} from '@ant-design/icons';
export default function Admin(){
    const history = useHistory();
    const [showContent, setshowContent] = useState(false);
    const [collapsed, setcollapsed] = useState(false);
    const [widthColl, setwidthColl] = useState(80);
    const key = "logout";

    useLayoutEffect(() => {
        function updateSize() {
            if(window.innerWidth<700){
                setcollapsed(true);
                setwidthColl(0);
            }else{
                setwidthColl(80);
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize();
    }, []);
    useEffect(()=>{
        document.getElementsByClassName("header-nav")[0].style.display = 'none';
        document.getElementsByClassName("footer")[0].style.display = 'none';
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
    const NavMenu = ()=>(
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ paddingTop:20 }}>
            <Menu.Item key="1" icon={<BarChartOutlined />}>
                <Link to="/admin/home">
                    Tổng quan
                </Link>
            </Menu.Item>
            <SubMenu key="sub1" icon={<DropboxOutlined />} title="Sản phẩm">
                <Menu.Item key="2">Thêm sản phẩm</Menu.Item>
                <Menu.Item key="3">Quản lý sản phẩm</Menu.Item>
            </SubMenu>
            <Menu.Item key="4" icon={<ContainerOutlined />}>
                <Link to="/admin/invoices">
                    Hóa đơn
                </Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<ShopOutlined />}>
                <Link to="/admin/inventory">
                    Quản lý kho hàng
                </Link>    
            </Menu.Item>
            <Menu.Item key="6" icon={<UserOutlined />}>
                <Link to="/admin/account">
                    Quản lý tài khoản
                </Link>    
            </Menu.Item>
            <Menu.Item key="7" icon={<GiftOutlined />}>
                <Link to="/admin/sale">
                    Sự kiện ưu đãi
                </Link>    
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
               <Header className="site-layout-background">
               {collapsed ? 
               <MenuUnfoldOutlined onClick={()=>setcollapsed(!collapsed)}/> 
               : 
               <MenuFoldOutlined onClick={()=>setcollapsed(!collapsed)}/>
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