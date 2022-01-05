import React from 'react';
import { Result,Button } from 'antd';
import {Link} from 'react-router-dom';
export default function NotifyAddProductSucess(){
    return(
        <div>
            <Result
                style={{ height:450,paddingTop:50 }}
                status="success"
                title="Thêm mới sản phẩm thành công!"
                subTitle="Sản phẩm của bạn đã được thêm"
                extra={[
                <Button type="primary">
                    <Link to="/admin">
                    Quay lại trang chủ
                    </Link>
                </Button>,
                <Button >
                    <Link to="/admin/manageProduct">
                    Quản lý sản phẩm
                    </Link>
                </Button>,
            ]}
          />
        </div>
    )
}