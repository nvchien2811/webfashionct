
import {Menu,message} from 'antd';

export default function menuAccount (props){
    const key = 'updatable';
    const {name} = props.data;
    const handleLogout = ()=>{
        message.loading({ content: 'Đang đăng xuất...', key });
        setTimeout(()=>{
            localStorage.removeItem("token");
            props.refreshAccount();
            message.success({ content: 'Đăng xuất thành công!', key, duration: 2 });
        },1000)
    }
    return(
        <Menu theme="dark">
            <Menu.Item key="control" >
                Bảng điều khiển
            </Menu.Item>
            <Menu.Item key="bill" >
                Đơn hàng
            </Menu.Item>
            <Menu.Item key="profile" >
                {"Thông tin tài khoản ("+name+")" }
            </Menu.Item>
            
            <Menu.Item key="logout" onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    )
}