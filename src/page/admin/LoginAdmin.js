import React,{useEffect,useState} from 'react';
import {Card,Form,Input,Button,Col,message} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import * as FetchAPI from '../../util/fetchApi';
import { useHistory } from 'react-router-dom';
export default function Admin(){
    const [username, setusername] = useState();
    const [password, setpassword] = useState();
    const [processLoading, setprocessLoading] = useState(false);
    const [formLogin] = Form.useForm();
    const history = useHistory();
    useEffect(()=>{
        document.getElementsByClassName("header-nav")[0].style.display = 'none';
        document.getElementsByClassName("footer")[0].style.display = 'none';
        document.getElementsByClassName("sc-bqiRlB bHmrDE rsc-float-button")[0].style.display = 'none';
    },[])
    const handleLogin = async() =>{
        setprocessLoading(true);
        const data = {"username":username,"password":password};
        const res = await FetchAPI.postDataAPI("/user/login",data);
        console.log(res);
      
        if(res.msg==="Invalid account"){
            message.error("Tên tài khoản không tồn tại");
            setprocessLoading(false);
        }else if(res.msg ==="Incorrect password"){
            message.error("Mật khẩu không đúng");
            setprocessLoading(false);
        }else if(res.msg==="Success"){
            finish(res.token);
        }
       
    }
    const finish = async(token)=>{
        const data = {"token":token};
        const res = await FetchAPI.postDataAPI("/user/getUser",data);
        if(res[0].ruler===1){
            message.success("Đăng nhập quản lý thành công !");
            formLogin.setFieldsValue({username:"",password:""})
            setusername("");
            setpassword("");
            localStorage.setItem("token_admin",token);
            history.push('/admin');
            setprocessLoading(false);
        }else{
            message.error("Vui lòng đăng nhập với tài khoản quản lý !!!");
            setprocessLoading(false);
        }
       
    }
    const Login = ()=>(
        <Form form={formLogin} onFinish={handleLogin} >
        <p style={{ fontSize:16,fontWeight:'bold' }}>Tên đăng nhập *</p>
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
                <Button htmlType="submit" type="primary" danger style={{ height:45,borderRadius:8 }} loading={processLoading}>
                    Đăng nhập
                </Button>
            </Form.Item>
            </Form>
    )
    return(
        <div 
            style={{ minHeight:window.innerHeight,justifyContent:'center',alignItems:'center',display:'flex' }}
        >
        <Col xl={12} xs={24} style={{ justifyContent:'center',display:'flex' }}>
        <Card style={{ width:'80%',borderRadius:10 }} title="Đăng nhập quản lý" bordered>
            {Login()}
        </Card>
        </Col>    
        </div>
    )
}