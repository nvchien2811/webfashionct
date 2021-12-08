import React,{useEffect,useState} from 'react';
import {Tabs,Table,Button} from 'antd';
import { useSelector } from 'react-redux';
import * as FetchAPI from '../../util/fetchApi';
import {getPriceVND} from '../../contain/getPriceVND';
import {Link} from 'react-router-dom';
import Spinner from '../../elements/spinner';
import moment from 'moment';
const { TabPane } = Tabs;
export default function BillFollow (){
    const datauser = useSelector(state=>state.userReducer.currentUser);
    const [fullData, setfullData] = useState();
    const [showContent, setshowContent] = useState(false);
    const [keyTab, setkeyTab] = useState("1");
    const [statusUser, setstatusUser] = useState(false);
    useEffect(()=>{
        setshowContent(false);
        setstatusUser(false)
        getBill()
    },[datauser])
    const getBill = async()=>{
        if(datauser.id!==undefined){
            try {
                const data = {"idUser":datauser.id}
                const res = await FetchAPI.postDataAPI("/order/getBillByIdUser",data);
                setstatusUser(true)
                setshowContent(true)
                setfullData(res);
            } catch (error) {
                        
            }
        }else{
            setshowContent(true)
        }
    }
    const columns  = [
        {
            title:"Đơn hàng",
            key:'id',
            render: record=>{
                return (
                    <span style={{ fontWeight:'bold' }}>{"#"+record.id}</span>
                )
            }
        },
        { 
            title:"Ngày Đặt",
            dataIndex:"",
            key:'date',
            render:(record)=>{
               return(
                   <span>{moment(record.create_at).format('YYYY-MM-DD HH:mm:ss')}</span>
               )
            }   
        },
        { 
            title:"Tình trạng",
            dataIndex:"",
            key:'status',
            render:(record)=>{
                if(record.status===0){
                    return <span style={{ color:'red' }}>Đang xử lý</span>
                }else if(record.status===1){
                    return <sapn style={{color:'blue' }}>Đang giao hàng</sapn>
                }else if(record.status===2) {
                    return <span style={{ color:'green' }}>Hoàn thành</span>
                }else{
                    return <span style={{ color:'gray' }}>Đã hủy</span>
                }
            }
        },
        { 
            title:"Tổng",
            dataIndex:"",
            key:'total',
            render:(record)=>{
               return <span>{getPriceVND(record.total_price) +" đ"}</span>
            }
        },
        { 
            title:"Các thao tác",
            dataIndex:"",
            key:'behavior',
            render:(record)=>{
               return (
               <Button>
                   <Link to={`/billdetails/${record.code_order}`}>
                        Chi tiết
                   </Link>
                </Button>
               )
            }
        },
    ]
    const TabContent = ()=>{
        let dataTmp = [];
        if(fullData!==undefined){
            if(keyTab==="1"){
                dataTmp = fullData.filter(e=>e.status!==4);
            }
            if(keyTab==="2"){
                dataTmp = fullData.filter(e=>e.status===0)
            }
            if(keyTab==="3"){
                dataTmp = fullData.filter(e=>e.status===1) 
            }
            if(keyTab==="4"){
                dataTmp = fullData.filter(e=>e.status===2) 
            }
            //sort by date soon as soon
            dataTmp.sort(function(a,b){
                return new Date(b.create_at) - new Date(a.create_at);
            });
        }
        return(
            <div className="wrapperTableBill">
                <Table 
                    columns={columns} 
                    dataSource={dataTmp} 
                    size="small"
                    locale={{ emptyText:"Bạn chưa có đơn hàng nào" }}/>
            </div>
        )
    }
    return(
        <div style={{ minHeight:450 }}>
            {showContent ? 
                <div>
                {statusUser ? 
                <div style={{ backgroundColor:'white',paddingTop:20,minHeight:450 }}>
                <Tabs defaultActiveKey="1" type="card" onChange={(e)=>setkeyTab(e)} size="small" tabPosition="top" centered>
                    <TabPane tab="Tất cả đơn hàng của bạn" key="1">
                            <TabContent />
                    </TabPane>
                    <TabPane tab="Đang xử lý" key="2">
                            <TabContent />
                    </TabPane>
                    <TabPane tab="Đang giao hàng" key="3">
                            <TabContent />
                    </TabPane>
                    <TabPane tab="Đã hoàn thành" key="4">
                            <TabContent />
                    </TabPane> 
                </Tabs>
                </div>
                :
                <div style={{ padding:"20px 40px" }}>
                    <span style={{ fontWeight:'bold' }}>Hãy đăng nhập để theo dõi đơn hàng...</span>
                </div>
                }
                </div>
                 :
                <Spinner spinning={!showContent}/>

            }
        </div>
    )
}