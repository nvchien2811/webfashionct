import React,{useEffect,useState,useLayoutEffect} from 'react';
import {Table,Select,Button,message} from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import {getPriceVND} from '../../contain/getPriceVND';
import {DeleteOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
const { Option } = Select;
export default function Invoices(){
    const [fulldataBill, setfulldataBill] = useState();
    const [loadingTable, setloadingTable] = useState(false);
    const [overflowX, setoverflowX] = useState(false);
    useLayoutEffect(() => {
        function updateSize() {
            if(window.innerWidth<700){
                setoverflowX(true);
            }else{
                setoverflowX(false);
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize();
    }, []);
    useEffect(()=>{
        setloadingTable(true);
        getFullBill()
    },[]) 
    const getFullBill = async()=>{
        const res = await FetchAPI.getAPI('/order/getFullBill');
        res.sort(function(a,b){
            return new Date(b.create_at) - new Date(a.create_at);
        });
        if(res!==undefined){
            setfulldataBill(res);
            setloadingTable(false);
        }
    }
    const hanldeUpdateStatus = async(value,code,id)=>{
        setloadingTable(true);
        const data = {"code_order":code,"status":value};
        const res = await FetchAPI.postDataAPI("/order/updateStatusBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    message.success("Cập nhật hóa đơn #"+id+" thành công !");
                    setloadingTable(false);
                },500)
            }else{
                setTimeout(()=>{
                    message.error("Có lỗi rồi !!");
                    setloadingTable(false);
                },500)
            }
        }
    }
    const columns = [
        {
            title:"Mã hóa đơn",
            key:'code',
            render: record=>(
                <span style={record.idUser===null?{color:'red',fontWeight:'bold' }:{ fontWeight:'bold' }}>
                    {"#"+record.id}
                </span>         
            )
        },
        {
            title:"Tên khách hàng",
            key:'username',
            render:record=><span>{record.name}</span>
        },
        {
            title:"Địa chỉ",
            key:'address',
            render:record=><span>{record.address}</span>
        },
        {
            title:"Email",
            key:'email',
            render:record=><span>{record.email}</span>
        },
        {
            title:"Điện thoại",
            key:'phone',
            render: record=><span>{record.phone}</span>
        },
        {
            title:"Tổng tiền",
            key:'total',
            render: record=><span style={{ fontWeight:'bold' }}>{getPriceVND(record.total_price)+" đ"}</span>
        },
        {
            title:"Tình trạng",
            key:'status',
            render: record=>{
                return(
                    <Select 
                        value={record.status}  
                        style={{ width: 120 }} 
                        onChange={(value)=>hanldeUpdateStatus(value,record.code_order,record.id)}
                        disabled={record.status===3}
                    >
                        <Option value={0}>
                            <span style={{ color:'red' }}>Đang xử lý</span>
                        </Option>
                        <Option value={1}>
                            <sapn style={{color:'blue' }}>Đang giao hàng</sapn>
                        </Option>
                        <Option value={2}>
                            <span style={{ color:'green' }}>Hoàn thành</span>
                        </Option>
                        <Option value={3} disabled>
                            <span style={{ color:'gray' }}>Đã hủy</span>
                        </Option>
                    </Select>
                )
            }
        },
        {
            title:"Tùy chỉnh",
            key:'option',
            render:record=>(
                <div style={{ display:'flex',flexDirection:'row',alignItems:'center' }}>
                    <Button>
                        <Link to={`/admin/billdetails/${record.code_order}`}>
                            Chi tiết
                        </Link>
                    </Button>
                    <DeleteOutlined style={{marginLeft:15,fontSize:20,cursor:"pointer" }} />
                </div>
            )
        }

    ]
    return(
    <div>
        <Table 
            columns={columns} 
            dataSource={fulldataBill} 
            size="small" 
            style={overflowX?{overflowX:'scroll'}:null} 
            loading={loadingTable} />
    </div>
    )
}