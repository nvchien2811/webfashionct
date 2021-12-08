import React,{useEffect,useState,useLayoutEffect,useRef} from 'react';
import {Table,Select,Button,message,Modal} from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import {getPriceVND} from '../../contain/getPriceVND';
import {DeleteOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {getColumnSearchProps} from '../../elements/SearchFilter';
const { Option } = Select;
import { useSelector } from 'react-redux';
export default function Invoices(){
    const [fulldataBill, setfulldataBill] = useState();
    const [loadingTable, setloadingTable] = useState(false);
    const [showModalDeleteBill, setshowModalDeleteBill] = useState(false);
    const [dataItemTmp, setdataItemTmp] = useState();
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);
    const searchInput = useRef();
 
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
    const hanldeUpdateStatus = async(value,code,id,email)=>{
        setloadingTable(true);
        const data = {"code_order":code,"status":value,"email": email};
        const res = await FetchAPI.postDataAPI("/order/updateStatusBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    getFullBill();
                    message.success("Cập nhật hóa đơn #"+id+" thành công !");
                },500)
            }else{
                setTimeout(()=>{
                    message.error("Có lỗi rồi !!");
                    setloadingTable(false);
                },500)
            }
        }
    }
    const handleDeleteItem = async()=>{
        setloadingTable(true);
        setshowModalDeleteBill(false);
        const data = {"code_order":dataItemTmp.code_order};
        const res = await FetchAPI.postDataAPI("/order/deleteBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success(`Bạn đã xóa hóa đơn #${dataItemTmp.id} thành công !`);
                getFullBill();
                setTimeout(()=>{
                    setloadingTable(false);
                },200)
            }else{
                message.error("Có lỗi rồi !!");
                setTimeout(()=>{
                    setloadingTable(false);
                },200)
            }
        }
    }
    const columns = [
        {
            title:"Mã hóa đơn",
            key:'code',
            filters: [
                { text: 'Đơn có tài khoản', value: "string" },
                { text: 'Đơn không tài khoản', value: "object" },
            ],
            onFilter: (value, record) => typeof(record.idUser)===value,
            render: record=>(
                <span style={record.idUser===null?{color:'red',fontWeight:'bold' }:{ fontWeight:'bold' }}>
                    {"#"+record.id}
                </span>         
            )
        },
        {
            title:"Tên khách hàng",
            key:'name',
            ...getColumnSearchProps('name',searchInput)
        },
        {
            title:"Địa chỉ",
            key:'address',
            render:record=><span>{record.address}</span>
        },
        {
            title:"Email",
            key:'email',
            ...getColumnSearchProps('email',searchInput),
        },
        {
            title:"Điện thoại",
            key:'phone',
            render: record=><span>{record.phone}</span>
        },
        {
            title:"Tổng tiền",
            key:'total',
            sorter: (a, b) => a.total_price - b.total_price,
            render: record=><span style={{ fontWeight:'bold' }}>{getPriceVND(record.total_price)+" đ"}</span>
        },
        {
            title:"Tình trạng",
            key:'status',
            filters: [
                { text: 'Đang xử lý', value: 0 },
                { text: 'Đang giao hàng', value: 1 },
                { text: 'Đã hoàn thành', value: 2 },
                { text: 'Đã hủy', value: 3 },
            ],
            onFilter: (value, record) => record.status===value,
            render: record=>{
                return(
                    <Select 
                        value={record.status}  
                        style={{ width: 120 }} 
                        onChange={(value)=>hanldeUpdateStatus(value,record.code_order,record.id,record.email)}
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
                    <DeleteOutlined 
                        style={{marginLeft:15,fontSize:20,cursor:"pointer" }} 
                        onClick={()=>{
                            setshowModalDeleteBill(true);
                            setdataItemTmp(record);
                        }}/>
                </div>
            )
        }

    ]
    return(
    <div>
        <p>Bạn cần xóa những đơn hàng khác đã hủy để đưa sản phẩm vào lại kho hàng.</p>

        <Table 
            showSorterTooltip={{ title: 'Nhấn để sắp xếp' }}
            columns={columns} 
            dataSource={fulldataBill} 
            size="small" 
            style={overflowX?{overflowX:'scroll'}:null} 
            loading={loadingTable} />
         {showModalDeleteBill &&
            <Modal
                title={`Bạn chắc chắn muốn xóa hóa đơn #${dataItemTmp.id}`}
                visible={showModalDeleteBill}
                onOk={handleDeleteItem}
                onCancel={()=>setshowModalDeleteBill(false)}
                cancelText="Thoát"
                okText="Chắc chắn"
            >
                <p>Bạn chắc chắn với quyết định của mình ! Tất cả dữ liệu về hóa đơn này sẽ bị xóa.</p>
                <p>Và các sản phẩm trong hóa đơn này sẽ được đưa lại vào kho hàng !</p>
            </Modal>
        }
    </div>
    )
}