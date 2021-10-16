import React ,{useState} from 'react';
import {Form,Input,Button,PageHeader,Result } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import * as FetchAPI from '../../util/fetchApi';
import {getUser} from '../../util/getUser';
import { useDispatch } from 'react-redux';
export default function Register(props){
    const {email} = props;
    const [name, setname] = useState();
    const [username, setusername] = useState();
    const [password, setpassword] = useState();
    const [confirmpass, setconfirmpass] = useState();
    const [success, setsuccess] = useState(false);
    const dispatch = useDispatch();

    const checkUserExist = async(_,value)=>{
        const data = {"username":value}
        const res = await FetchAPI.postDataAPI("/user/checkUsername",data);
        if(res.success){
            return Promise.resolve();
        }else{
            return Promise.reject(new Error('Tên đăng nhập đã tồn tại, vui lòng chọn tên khác  !'));
        }
    }
    const handleRegister = async()=>{
        props.loading(true);
        const data = {"email":email,"password":password,"username":username,"name":name};
        const res = await FetchAPI.postDataAPI("/user/register",data);
        if(res.success){
            setsuccess(true);
            props.loading(false);
        }else{
            console.log("Có lỗi rồi");
            props.loading(false);
        }
    }
    const handleLogin = async() =>{
        props.loading(true)
        const data = {"username":username,"password":password};
        const res = await FetchAPI.postDataAPI("/user/login",data);
        console.log(res);
        if(res.msg==="Error"){
            console.log("Thất bại")
        }else if(res.msg==="Success"){
            localStorage.setItem("token",res.token);
            finish(res.token)
        }
        props.loading(false);
    }
    const finish = async(token)=>{
        getUser(token,dispatch);
        props.refeshAccount();
        props.cancel();
    }
    const SignUp = ()=>(
        <div>
        <PageHeader
            onBack={() => props.back()}
            title={"Tiếp tục đăng ký với "}
            subTitle={email}
            style={{padding:0}}
        />
        <Form 
            style={{ paddingBottom:40,paddingTop:20,display:'flex',flexDirection:'column',alignItems:'center' }} 
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 14 }}
            onFinish={handleRegister}
            scrollToFirstError>
            <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Nhập đầy đủ họ tên"
                    value={name}
                    defaultValue={name}
                    onChange= {(e)=>setname(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item
                label="Tên đăng nhập"
                name="username"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập họ tên !' },
                    { validator: checkUserExist}
                ]}
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
            <Form.Item
                label="Mật khẩu"
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
            <Form.Item
                name="confirm"
                label="Nhập lại mật khẩu"
                style={{width:'80%'}}
                hasFeedback
                rules={[
                {
                    required: true,
                    message: 'Vui lòng nhập lại mật khẩu!',
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu nhập lại phải đúng như trên!'));
                    },
                }),
                ]}
            >
                <Input.Password
                    placeholder="Nhập mật khẩu"
                    value={confirmpass}
                    defaultValue={confirmpass}
                    onChange= {(e)=>setconfirmpass(e.target.value)}
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item style={{ padding:"10px 0px" }} >
                <Button htmlType="submit" type="primary" danger style={{ width:100,height:45,borderRadius:8 }}>
                   Đăng ký
                </Button>
            </Form.Item>
            
        </Form>
        </div>
    )
    const ResultSccuess = ()=>(
        <Result
            status="success"
            title="Đăng ký thanh công !"
            subTitle="Bạn có muốn đăng nhập ngày bây giờ"
            extra={[
            <Button onClick={handleLogin} type="primary" key="console">
                Đăng nhập ngay !
            </Button>,
            <Button onClick={props.cancel} key="buy">Để sau</Button>,
            ]}
        />
    )
    return(
        <div>
            {success ? 
            <ResultSccuess/>
            :
            <div>
                {SignUp()}
            </div>
            }
           
        </div>
    )

}