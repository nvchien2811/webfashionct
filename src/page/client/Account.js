import React ,{useState} from 'react';
import {Modal,Row,Col,Input,Button,Spin,Form,message} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import * as FetchAPI from '../../util/fetchApi';
import {getUser} from '../../util/getUser'
import { useDispatch } from 'react-redux';
import Register from './Register';

export default function Account(props) {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [spinning, setspinning] = useState(false);
    const [emailRegister, setemailRegister] = useState("");
    const [continueRegister, setcontinueRegister] = useState(false);
    const [formLogin] = Form.useForm();
    const dispatch = useDispatch();
    const handleLoginValidation = ()=>{
        setspinning(true);
        //Validation
        handleLogin();
    }
    const handleLogin = async() =>{
        const data = {"username":username,"password":password};
        const res = await FetchAPI.postDataAPI("/user/login",data);
        console.log(res);
      
        if(res.msg==="Invalid account"){
            message.error("Tên tài khoản không tồn tại")
        }else if(res.msg ==="Incorrect password"){
            message.error("Mật khẩu không đúng")
        }else if(res.msg==="Success"){
            localStorage.setItem("token",res.token);
            finish(res.token);
            message.success("Đăng nhập thành công !");
            formLogin.setFieldsValue({username:"",password:""})
            setusername("");
            setpassword("");
        }
        setspinning(false);
    }
    const finish = async(token)=>{
        getUser(token,dispatch);
        props.refeshAccount();
        props.onCancel();
    }

    const checkEmailExist = async(_,value)=>{
        const data = {"email":value}
        const res = await FetchAPI.postDataAPI("/user/checkEmail",data);
        if(res.success){
            return Promise.resolve();
        }else{
            return Promise.reject(new Error('Email đã tồn tại trong hệ thống, vui lòng chọn email khác  !'));
        }
    }
    const handleRegister = async()=>{
        setcontinueRegister(true)
    }
    const Login = ()=>(
        <Form 
            style={{ paddingBottom:40 }} 
            onFinish={handleLoginValidation} 
            form={formLogin}
            scrollToFirstError
        >
            <p style={{ fontSize:18,fontWeight:'bold' }}>ĐĂNG NHẬP</p>
            <p style={{ fontSize:16,fontWeight:'bold' }}>Tên tài khoản hoặc email đăng nhập *</p>
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Nhập tên tài khoản"
                    value={username}
                    defaultValue={username}
                    onChange= {(e)=>setusername(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <p style={{ fontSize:16,fontWeight:'bold' }}>Mật khẩu *</p>
            <Form.Item
                name="password"
                rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    {min:3,message:'Mật khẩu ít nhất 3 ký tự'}
                ]}
                style={{width:'80%'}}
            >
                <Input.Password
                    placeholder="Nhập mật khẩu"
                    value={password}
                    defaultValue={password}
                    onChange= {(e)=>setpassword(e.target.value)}
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item style={{ padding:"10px 0px" }} >
                <Button htmlType="submit" type="primary" danger style={{ width:100,height:45,borderRadius:8 }}>
                    Đăng nhập
                </Button>
            </Form.Item>
            <div>
                <span>Quên mật khẩu ?</span>
            </div>
        </Form>
    )
    const SignUp = ()=>(
        <Form onFinish={handleRegister}>
            <p style={{ fontSize:18,fontWeight:'bold' }}>ĐĂNG KÝ</p>
            <p style={{ fontSize:16,fontWeight:'bold' }}>Địa chỉ email *</p>
            <Form.Item 
                style={{ width:'80%' }} 
                hasFeedback
                rules={[
                    { type: 'email',message:"Vui lòng nhập đúng Email"},
                    {required:true,message:"Vui lòng điền Email !"},
                    { validator: checkEmailExist}
                ]}
                name={['user', 'email']}
            >
                <Input
                    placeholder="Nhập email"
                    value={emailRegister}
                    onChange= {(e)=>setemailRegister(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <p style={{ fontSize:16,padding:"10px 0px" }}>Dùng email để đăng ký với Fashion CT</p>
            <p>Thông tin cá nhân của bạn sẽ được sử dụng để tăng trải nghiệm sử dụng website, quản lý truy cập vào tài khoản của bạn, và cho các mục đích cụ thể khác được mô tả trong chính sách riêng tư.</p>
            <Form.Item style={{ padding:"10px 0px" }}>
                <Button type="primary" danger style={{ width:100,height:45,borderRadius:8 }} htmlType="submit">
                    Tiếp tục
                </Button>
            </Form.Item>
        </Form>
    )
    return(
        <Modal 
            title="Tài khoản" 
            visible={props.visible} 
            onCancel={()=>{props.onCancel();setcontinueRegister(false)}}
            cancelText="Thoát"
            footer={false}
            width={1000}
        >
            <Spin spinning={spinning} >
            {!continueRegister ?
            <Row>
                <Col md={12} xs={24}>
                    {Login()}
                </Col>
                <Col md={12} sm={24}>
                    {SignUp()}
                </Col>
            </Row>
            :
            <Register 
                email={emailRegister} 
                back={()=>setcontinueRegister(false)}
                cancel={()=>{props.onCancel();setcontinueRegister(false)}}
                loading={(e)=>setspinning(e)}
                refeshAccount={props.refeshAccount}
            />
            }
           
            </Spin>
        </Modal>
    )
}