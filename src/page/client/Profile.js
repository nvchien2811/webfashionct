import React,{useEffect,useState} from 'react';
import { useSelector} from 'react-redux';
import Spinner from '../../elements/spinner';
import * as FetchAPI from '../../util/fetchApi';
import {Form,Input,Button,message} from 'antd';

export default function Profile(){
    const [showContent, setshowContent] = useState(false);
    const currentUser = useSelector(state=>state.userReducer.currentUser);
    const [dataUser, setdataUser] = useState();
    const [loadingBtn, setloadingBtn] = useState(false);
    const [formInfor] = Form.useForm();
    useEffect(()=>{
        setshowContent(false)
        if(currentUser.id==undefined){
            setshowContent(true)
        }else{
            getInforUser()
        }
    },[currentUser])
  
    const getInforUser = async()=>{
        const data = {"idUser":currentUser.id}
        const res = await FetchAPI.postDataAPI("/user/getInforUser",data)
        setdataUser(res[0])
        formInfor.setFieldsValue(res[0])
        setshowContent(true)
    }
    const handleEditProfile = async()=>{
        setloadingBtn(true)
        const res = await FetchAPI.postDataAPI("/user/updateProfile",{data:dataUser});
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    message.success("Cập nhật thành công")
                    setloadingBtn(false)
                },500)
              
            }else{
                setTimeout(()=>{
                    message.error("Có lỗi rồi !!")
                    setloadingBtn(false)
                },500)
               
            }
        }
    }
   
    const InforUser = ()=>(
        <Form
            form={formInfor}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            style={{paddingTop:20}}
            onFinish={handleEditProfile}
          
        >
            <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: 'Nhập họ và tên'}]}
            >
                <Input 
                    placeholder="Nhập họ và tên đầy đủ"
                    value={dataUser.name}
                    onChange= {(e)=>setdataUser({...dataUser,name:e.target.value})}
                />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
            >
                <Input 
                    placeholder="Nhập email"
                    disabled
                />
            </Form.Item>
            <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: 'Nhập địa chỉ'}]}
            >
                <Input 
                    placeholder="Nhập địa chỉ"
                    value={dataUser.address}
                    onChange= {(e)=>setdataUser({...dataUser,address:e.target.value})}
                />
            </Form.Item>
            <Form.Item
                label="Số điện thoại"
                name = "phone"
                rules={[{ required: true, message: 'Nhập số điện thoại'}]}
            >
                <Input
                    placeholder="Số điện thoại"
                    value={dataUser.phone}
                    onChange= {(e)=>setdataUser({...dataUser,phone:e.target.value})}
                />
            </Form.Item>
            <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                    Cập nhật
                </Button>
            </Form.Item>
        </Form>
    )
    return(
        <div style={{ minHeight:450 }}>
            {showContent ?
                <div>
                    {currentUser.id==undefined ?
                    <span style={{ margin:"20px 10px" }}>
                        Vui lòng đăng nhập để xem thông tin...
                    </span>
                    :
                    <div style={{ padding:"20px 20px" }}>
                        Lưu thông tin cá nhân của bạn để thuận tiện cho việc thanh toán
                        {InforUser()}
                    </div>
                
                    }
                </div>
                :
                <Spinner spinning={!showContent}/>
           }
        </div>
    )
}