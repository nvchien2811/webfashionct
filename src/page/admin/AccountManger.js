import React ,{useEffect,useState,useRef} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import { useSelector } from 'react-redux';
import {Table,Select,message,Modal,Form,Input} from 'antd';
import Spinner from '../../elements/spinner';
import {getColumnSearchProps} from '../../elements/SearchFilter';
import {InfoCircleOutlined} from '@ant-design/icons'
const {Option} = Select;

export default function AccountManger(){
    const [dataUser, setdataUser] = useState();
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);
    const [showContent, setshowContent] = useState(false);
    const [showModalInforAccount, setshowModalInforAccount] = useState(false);
    const [dataInfor, setdataInfor] = useState([]);
    const searchInput = useRef();
    const [formInfor] = Form.useForm();
    useEffect(()=>{
        setshowContent(false);
        getUser();
    },[])
    const getUser = async()=>{
        const res = await FetchAPI.getAPI("/user/getFullUser");
        console.log(res[0])
        setdataUser(res)
        setshowContent(true);
    }
    const updateStatusUser = async(e,id)=>{
        const data = {"id":id,"status":e}
        const res = await FetchAPI.postDataAPI("/user/updateStatusUser",data)
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Cập nhật thành công");
                getUser();
            }else{
                message.error("Có lỗi rồi !!")
            }
        }
    }
    const columns = [
        {
            title:"Mã tài khoản",
            key:'id',
            render: record=><span>{record.id}</span>
        },
        {
            title:"Email",
            key:'email',
            ...getColumnSearchProps('email',searchInput)
        },
        {
            title:"Tên khách hàng",
            key:'name',
            render: record=><span>{record.name}</span>
        },
        {
            title:"Trạng thái",
            key:"status",
            render: record=>(
                <Select 
                    value={record.status}
                    onChange= {(e)=>updateStatusUser(e,record.id)}
                >
                    <Option value={0}>
                        Hoạt động
                    </Option>
                    <Option value={1}>
                        Tạm khóa
                    </Option>
                </Select>
            )
        },
        {
            title:"Chi tiết",
            key:'details',
            render: record=>
            <div style={{ paddingLeft:15 }}>
                <InfoCircleOutlined 
                    style={{fontSize:18,cursor:"pointer" }} 
                    onClick={()=>{
                        getInforUser(record.id)
                    }}
                />
            </div>
        }
    ]
    const getInforUser = async(id)=>{
        const data = {"idUser":id}
        const res = await FetchAPI.postDataAPI("/user/getInforUser",data)
        setdataInfor(res[0]);
        formInfor.setFieldsValue(res[0])
        setshowModalInforAccount(true);
    }
    return(
    <div>
        {showContent ?
        <div>
        <Table 
            dataSource={dataUser}
            columns={columns}
            style={overflowX?{overflowX:'scroll'}:null} 
        />
        {showModalInforAccount &&
            <Modal
                title={`Thông tin khách hàng ${dataInfor.id}`}
                visible={showModalInforAccount}
                onCancel={()=>setshowModalInforAccount(false)}
                cancelText="Thoát"
                okButtonProps={{
                    style: {
                      display: "none",
                    },
                }}
            >
                <Form
                    form={formInfor}
                    labelCol={{ xl:6,md:6,sm:8}}
                    wrapperCol={{ xl:15,md:15,sm:13 }}
                >
                    <Form.Item 
                        label="Email"
                        name="email"
                    >
                        <Input 
                            placeholder="Email khách hàng"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Tên đăng nhập"
                        name="username"
                    >
                        <Input 
                            placeholder="Tên đăng nhập của khách hàng"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Tên khách hàng"
                        name="name"
                    >
                        <Input 
                            placeholder="Tên khách hàng"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Địa chỉ"
                        name="address"
                    >
                        <Input 
                            placeholder="Khách hàng chưa cung cấp thông tin này"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Số điện thoại"
                        name="phone"
                    >
                        <Input 
                            placeholder="Khách hàng chưa cung cấp thông tin này"
                            disabled
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Số đơn hàng"
                        name="totalBill"
                    >
                        <span> {formInfor.getFieldValue(['totalBill'])}</span>
                    </Form.Item>
                    <Form.Item 
                        label="Trạng thái"
                        name="status"
                    >
                        {formInfor.getFieldValue(['status'])==0?
                        <span style={{ color:'green',fontWeight:'bold' }}>Hoạt động</span>
                        :
                        <span style={{ color:'red',fontWeight:'bold' }}>Tạm khóa</span>
                        }
                    </Form.Item>
                </Form>
            </Modal>
        }
        </div>
        
        :
        <Spinner spinning={!showContent}/>
        }
    </div>
    )
}