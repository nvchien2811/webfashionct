import React ,{useEffect,useState}from 'react'; 
import { PageHeader,Table,Row,Col,Space,Card ,Button,message,Modal} from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import {getPriceVND} from '../../contain/getPriceVND';
import Spinner from '../../elements/spinner';
import { useSelector } from 'react-redux';
import { useParams,useHistory } from 'react-router-dom';
import ModalReviewProduct from '../../elements/ModalReviewProduct';
export default function BillDetails(){
    const history = useHistory();
    const [dataProduct, setdataProduct] = useState();
    const [dataBill, setdataBill] = useState();
    const [totalTmp, settotalTmp] = useState(0);
    const [showContent, setshowContent] = useState(false);
    const [promotionprice, setpromotionprice] = useState(0);
    const [showModalReview, setshowModalReview] = useState(false);
    const [showModalCancel, setshowModalCancel] = useState(false);
    const [dataSale, setdataSale] = useState();
    const currentUser = useSelector(state=>state.userReducer.currentUser);
    const [statusUser, setstatusUser] = useState(false);
    const {idBill} = useParams();

    useEffect(()=>{
        console.log(idBill)
        setstatusUser(false);
        setshowContent(false)
        getProduct();
        getInforPayment();
    },[currentUser])
    const getProduct = async()=>{
        const data = {"idOrder":idBill}
        const product = await FetchAPI.postDataAPI('/order/getProductByIdBill',data);
        if(product!==undefined){
            let total = 0;
            product.map((e,index)=>{
                total+= e.price*e.quanity;
                if(index===product.length-1){
                    settotalTmp(total);
                }
                return false;
            })
        }
        setdataProduct(product);
    }
    const getInforPayment = async()=>{
        const data = {"idOrder":idBill}
        const bill = await FetchAPI.postDataAPI('/order/getBillById',data);
        if(currentUser.id===undefined){
            setstatusUser(false)
        }else{
            if(currentUser.id===bill[0].idUser){
                setstatusUser(true)
            }
        }
        setdataBill(bill[0])
        if(bill[0].idSale!==null){
            getSale(bill[0].idSale);
        }
        setshowContent(true)
    }
    const getSale = async(idSale)=>{
        const res = await FetchAPI.postDataAPI("/order/getSaleById",{"idSale":idSale})
        if(res!==undefined){
            setdataSale(res[0])
            setpromotionprice(res[0].cost_sale)
        }
    }
    const handleCancelBill = async()=>{
        const data = {"code_order":dataBill.code_order,"status":3,"email":currentUser.email}
        const res = await FetchAPI.postDataAPI("/order/updateStatusBill",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    setshowModalCancel(false)
                    message.success("Hủy đơn hàng thành công !");
                    history.goBack();
                },500)
            }else{
                setTimeout(()=>{
                    setshowModalCancel(false)
                    message.error("Có lỗi rồi !!");
                 
                },500)
            }
        }
    }
    const ModalCancelBill = ()=>(
        <Modal
            title={`Bạn chắc chắn muốn hủy đơn #${dataBill.id}`}
            visible={showModalCancel}
            onOk={handleCancelBill}
            onCancel={()=>setshowModalCancel(false)}
            cancelText="Thoát"
            okText="Chắc chắn"
        >
            <p>Bạn chắc chắn với quyết định của mình ! Đơn hàng này của bạn sẽ bị hủy.</p>
        </Modal>
    )
    const columns  = [
        {
            title:"Sản phẩm",
            key:'product',
            render : record=>{
                return(
                    <div>
                        <span>{record.name_product+" ( "+record.size +" )"}</span>
                        <span style={{ paddingLeft:20,fontWeight:'bold' }}>{"X" +record.quanity}</span>
                    </div>
                )
            }
        },
        {
            title:"Tổng",
            key:'total_price',
            render: record=>{
                return <span>{getPriceVND(record.price*record.quanity) +" đ"}</span>
            }
        }
    ]
    const ViewProduct = ()=>(
        <Table 
            columns={columns}
            dataSource={dataProduct}
            pagination={false} 
            size="small"
            summary={()=>(
                <Table.Summary>
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Tạm tính</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>{getPriceVND(totalTmp)+" đ"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                    {dataSale !== undefined &&
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Mã khuyến mãi</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{"-"+getPriceVND(promotionprice)+" đ"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    }
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Phí vận chuyển</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>{getPriceVND(30000)+" đ"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Tổng</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>{getPriceVND(totalTmp-promotionprice+30000)+" đ"}</Table.Summary.Cell>
                    </Table.Summary.Row>
                    {dataBill.status===2 &&
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Đánh giá sản phẩm</span></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                            <Button onClick={()=>setshowModalReview(true)}>
                                Đánh giá ngay
                            </Button>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                    }
                </Table.Summary>
        )}
        />      
    )
    const getTextStatus = (a)=>{
        if(a===0){
            return <b>Đang xử lý</b>
        }else if(a===1){
            return <b>Đang giao hàng</b>
        }else if(a===2){
            return <b>Đã hoàn thành</b>
        }else{
            return <b>Đã hủy</b>
        }
    }
    return(
        <div style={{ minHeight:450,paddingBottom:20 }}>
            {showContent ?
            <div>
            {statusUser ?
            <div>
                
            <PageHeader
                className="site-page-header"
                onBack={() => history.goBack()}
                title="Chi tiết đơn hàng"
                subTitle={"Mã đơn hàng: #"+dataBill.id}
            />
            <Row>
            <Col lg={14} xs={24} style={{ padding:"20px 40px" }} >
                {ViewProduct()}
                <Card title="Địa chỉ thanh toán" style={{ marginTop:30 }}>
                <div style={{ fontSize:16 }}>
                <Space direction="vertical" size={20}>
                    <span><b>Tên: </b>{dataBill.name}</span>
                    <span><b>Địa chỉ: </b>{dataBill.address}</span>
                    <span><b>Email: </b>{dataBill.email}</span>
                    <span><b>Số điện thoại: </b>{dataBill.phone} </span>
                </Space>
                </div>
                </Card>
            </Col>
            <Col lg={10} xs={24} style={{ justifyContent:'center',display:'flex' }}>
                <Card title="Cảm ơn bạn. Đơn hàng đã được nhận." style={{ marginTop:20,width:'80%' }}>
                <ul>
                    <Space size={10} direction="vertical">
                        <li>Mã đơn hàng : <b>{"#"+dataBill.id}</b></li>
                        <li>Ngày đặt: <b>{new Date(dataBill.create_at).toString()}</b></li>
                        <li>Email : <b>{dataBill.email}</b></li>
                        <li>Tổng cộng : <b>{getPriceVND(totalTmp-promotionprice)+" đ"}</b></li>
                        <li>Thời gian cập nhật hóa đơn: <b>{new Date(dataBill.update_at).toString()}</b></li>
                        <li>Phương thức thanh toán: 
                            <b>{dataBill.methodPayment===1 ? "Chuyển khoản ngân hàng":"Trả tiền mặt"}</b>
                        </li>
                        <li>
                            Tình trạng : {getTextStatus(dataBill.status)}
                        </li>
                        <div>
                            <Button type="primary" onClick={()=>setshowModalCancel(true)} danger disabled={dataBill.status!==0} >
                                Hủy đơn
                            </Button>
                        </div>
                    </Space>
                </ul>
                </Card>
            </Col>
            </Row> 
            <ModalReviewProduct 
                visible={showModalReview}
                onCancel={()=>setshowModalReview(false)}
                refresh={()=>getProduct()}
                dataProduct={dataProduct}
                user={currentUser}
            /> 
            {ModalCancelBill()}
            </div>
            :
            <div style={{ padding:"20px 40px" }}>
                <span style={{ fontWeight:'bold' }}>Bạn không có quyền truy cập hóa đơn này...</span>
            </div>
            }
            </div>
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}