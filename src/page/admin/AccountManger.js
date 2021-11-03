import React ,{useEffect,useState,useRef} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import { useSelector } from 'react-redux';
import {Table,Select,message} from 'antd';
import Spinner from '../../elements/spinner';
import {getColumnSearchProps} from '../../elements/SearchFilter';
const {Option} = Select;
export default function AccountManger(){
    const [dataUser, setdataUser] = useState();
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);
    const [showContent, setshowContent] = useState(false);
    const searchInput = useRef();
    useEffect(()=>{
        setshowContent(false);
        getUser();
    },[])
    const getUser = async()=>{
        const res = await FetchAPI.getAPI("/user/getFullUser");
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
        }
    ]
    return(
    <div>
        {showContent ?
        <Table 
            dataSource={dataUser}
            columns={columns}
            style={overflowX?{overflowX:'scroll'}:null} 
        />
        :
        <Spinner spinning={!showContent}/>
        }
    </div>
    )
}