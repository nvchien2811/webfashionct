import React ,{useState} from 'react';
import {Modal,Row,Col,Input,Button,Spin} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import * as FetchAPI from '../../util/fetchApi';
export default function Account(props) {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState();
    const [email, setemail] = useState();
    const [spinning, setspinning] = useState(false);

    const handleLoginValidation = ()=>{
        setspinning(true);
        //Validation
        handleLogin();
    }
    const handleLogin = async() =>{
        const data = {"username":username,"password":password};
        console.log(username + " and "+ password)
        const res = await FetchAPI.postDataAPI("/user/login",data);
        console.log(res);
        if(res.msg==="Error"){
            console.log("Thất bại")
        }else if(res.msg==="Success"){
            localStorage.setItem("token",res.token);
            getUser(res.token)
        }
        setspinning(false);
    }
    const getUser = async(token)=>{
        const data = {"token":token};
        const res = await FetchAPI.postDataAPI("/user/getUser",data);
        console.log(res)
    }
    const Login = ()=>(
        <div style={{ paddingBottom:40 }}>
            <p style={{ fontSize:18,fontWeight:'bold' }}>ĐĂNG NHẬP</p>
            <p style={{ fontSize:16,fontWeight:'bold' }}>Tên tài khoản hoặc email đăng nhập *</p>
            <div style={{ width:'80%' }}>
                <Input
                    placeholder="Nhập tên tài khoản"
                    value={username}
                    onChange= {(e)=>setusername(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </div>
            <p style={{ fontSize:16,fontWeight:'bold' }}>Mật khẩu *</p>
            <div style={{ width:'80%' }}>
            <Input.Password
                placeholder="Nhập mật khẩu"
                value={password}
                onChange= {(e)=>setpassword(e.target.value)}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                maxLength={24}
                style={{height:40}}
            />
            </div>
            <div style={{ padding:"10px 0px" }}>
                <Button type="primary" danger style={{ width:100,height:45,borderRadius:8 }} onClick={handleLoginValidation}>
                    Đăng nhập
                </Button>
            </div>
            <div>
                <span>Quên mật khẩu ?</span>
            </div>
        </div>
    )
    const SignUp = ()=>(
        <div>
            <p style={{ fontSize:18,fontWeight:'bold' }}>ĐĂNG KÝ</p>
            <p style={{ fontSize:16,fontWeight:'bold' }}>Địa chỉ email *</p>
            <div style={{ width:'80%' }}>
                <Input
                    placeholder="Nhập email"
                    value={email}
                    onChange= {(e)=>setemail(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </div>
            <p style={{ fontSize:16,padding:"10px 0px" }}>Dùng email để đăng ký với Fashion CT</p>
            <p>Thông tin cá nhân của bạn sẽ được sử dụng để tăng trải nghiệm sử dụng website, quản lý truy cập vào tài khoản của bạn, và cho các mục đích cụ thể khác được mô tả trong chính sách riêng tư.</p>
            <div style={{ padding:"10px 0px" }}>
                <Button type="primary" danger style={{ width:100,height:45,borderRadius:8 }}>
                    Tiếp tục
                </Button>
            </div>
        </div>
    )
    return(
        <Modal 
            title="Tài khoản" 
            visible={props.visible} 
            onCancel={props.onCancel}
            cancelText="Thoát"
            footer={false}
            width={1000}
        >
            <Spin spinning={spinning} >
            <Row>
                <Col md={12} xs={24}>
                    {Login()}
                </Col>
                <Col md={12} sm={24}>
                    {SignUp()}
                </Col>
            </Row>
            </Spin>
        </Modal>
    )
}