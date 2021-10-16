import React from 'react';
import {Menu} from 'antd'
export default function menuAccount (props){
    return(
        <Menu theme="dark">
            <Menu.Item key="control" >
                Bảng điều khiển
            </Menu.Item>
            <Menu.Item key="bill" >
                Đơn hàng
            </Menu.Item>
            <Menu.Item key="profile" >
                Thông tin tài khoản
            </Menu.Item>
            <Menu.Item key="logout" onClick={()=>{localStorage.removeItem("token");props.refreshAccount()}}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    )
}