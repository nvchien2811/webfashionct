import React from 'react';
import {Layout,Row,Col} from 'antd';
import logo from '../images/Fashion-removebg-preview.png';
import {FacebookFilled,GoogleCircleFilled,GithubFilled,TwitterCircleFilled} from '@ant-design/icons'
import {Link} from 'react-router-dom';
const {Footer} = Layout;
export default function FooterWeb (){
    return(
        <Footer className="footer">
            <Row>
                <Col xl={6} className="widget-footer style1">
                    <div>
                        <img className="img-logo" src={logo} width='120' height='120' alt="logo"/>
                    </div>
                    <div>
                    <span>
                        “Thời trang cho mọi người” nhắm đến đối tượng khách hàng vô cùng đa dạng, 
                        từ phụ nữ, trẻ em cho đến các đấng mày râu.
                        Thậm chí, ngay trong tên thương hiệu CTFASHION đã ngầm chứa định hướng này
                    </span>
                    </div>
                </Col>
                <Col xl={6} className="widget-footer style2">
                    <h2 className="widget-title-footer">Tài khoản</h2>
                    <ul>
                        <li><Link to={{ pathname:"/" }}>Đăng nhập</Link></li>
                        <li><Link to={{ pathname:"/" }}>Đăng ký</Link></li>
                        <li><Link to={{ pathname:"/billfollow" }}>Đơn hàng</Link></li>
                        <li><Link to={{ pathname:"/cart" }}>Giỏ hàng</Link></li>
                    </ul>
                </Col>
                <Col xl={6} className="widget-footer style3">
                <h2 className="widget-title-footer">Cửa hàng</h2>
                    <ul>
                        <li><Link to={{ pathname:"/" }}>Khám phá</Link></li>
                        <li><Link to={{ pathname:"/" }}>Liên hệ</Link></li>
                        <li><Link to={{ pathname:"/" }}>Giới thiệu</Link></li>
                    </ul>
                </Col>
                <Col xl={6} className="widget-footer style4">
                <h2 className="widget-title-footer">Phản hồi với chúng tôi</h2>
                <ul>
                    <li><a href="https://www.facebook.com/ken.navi.1/" target="_blank"><FacebookFilled/></a></li>
                    <li><a><GoogleCircleFilled /></a></li>
                    <li><a href="https://github.com/nvchien2811" target="_blank"><GithubFilled /></a></li>
                    <li><a><TwitterCircleFilled /></a></li>
                </ul>
                </Col>
            </Row>
        </Footer>
    )
}