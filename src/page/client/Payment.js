import React ,{useEffect,useState}from 'react';
import {Row,Col,Form,Input,Button,Table,Radio,Space,Result } from "antd";
import { useSelector,useDispatch } from 'react-redux';
import {getPriceVND} from '../../contain/getPriceVND';
import {Link,useLocation} from 'react-router-dom';
import * as FetchAPI from '../../util/fetchApi';
import {updateCartCurrent} from '../../contain/updateQuanityCart';

export default function Payment (props){
    const [name, setname] = useState("");
    const [email, setemail] = useState();
    const [phone, setphone] = useState();
    const [address, setaddress] = useState();
    const [message, setmessage] = useState();
    const [totalTmp, settotalTmp] = useState(0);
    const [idUser, setidUser] = useState("");
    const [promoprice, setpromoprice] = useState(0);
    const dataCart = useSelector(state=>state.productReducer.cart);
    const datauser = useSelector(state=>state.userReducer.currentUser);
    const [dataSale, setdataSale] = useState();
    const dispatch = useDispatch();
    const [showUser, setshowUser] = useState(false);
    const [methodPayment, setmethodPayment] = useState(1);
    const [form] = Form.useForm();
    const [paymentSucess, setpaymentSucess] = useState(false);
    const textMethodBank = "Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng Mã đơn hàng của bạn trong phần Nội dung thanh toán. Đơn hàng sẽ đươc giao sau khi tiền đã chuyển."
    const location = useLocation();
    useEffect(()=>{
        setpaymentSucess(false)
        setshowUser(false)
        if(location.dataSale!==undefined){
            setdataSale(location.dataSale)
            setpromoprice(location.dataSale.cost_sale)
        }
        if(dataCart.length!==undefined){
            let total = 0;
            dataCart.map((e,index)=>{
                if(e[0].promotional===null){
                    total+=e[0].price*e.quanity
                }else{
                    total+=e[0].promotional*e.quanity
                }
                if(index===dataCart.length-1){
                    settotalTmp(total)
                }
                return false
            })
        }  
        getUser(); 
    },[datauser])
    const getUser = async()=>{
        if(datauser.name!==undefined){
            const res = await FetchAPI.postDataAPI("/user/getInforUser",{"idUser":datauser.id})
            const user = res[0];
            form.setFieldsValue({name:user.name,email:user.email,address:user.address,phone:user.phone})
            setname(user.name);
            setemail(user.email);
            setidUser(user.id);
            setaddress(user.address);
            setphone(user.phone);
            setshowUser(true)
        }else{  
            form.setFieldsValue({name:"",email:"",address:"",phone:""})
            setname("");
            setemail("");
            setidUser("");
            setaddress("");
            setphone("");
            setshowUser(true);
        }
    }
    const handleValidationOrder = ()=>{
        if(methodPayment===2){
            handleOrder();
        }else{
            console.log("Thanh toán sau")
        }
    }
    const handleOrder = async()=>{
        let idSale = null;
        let total = totalTmp+30000;
        if(dataSale!== undefined){
            idSale = dataSale.id
            total = total-dataSale.cost_sale
        }
        const data = {
            "name": name,
            "address": address,
            "email" : email,
            "phone" : phone,
            "total_price":total,
            "message":message,
            "dataProduct":dataCart,
            "methodPayment":methodPayment,
            "user": idUser,
            "idSale":idSale,
        }
        const res = await FetchAPI.postDataAPI("/order/addBill",data);
        if(res.msg){
            if(res.msg==="success"){
                localStorage.removeItem("cart");
                updateCartCurrent(dispatch);
                setpaymentSucess(true)
            }else{
                console.log(res.msg)
            }
        }
    }
    const columns  = [
        {
            title:"Sản phẩm",
            key:'name',
            render: record=>{
                return (
                    <Row>
                        <span>{record[0].name+" - ( "+record.option+" )"}</span>
                        <span style={{ fontWeight:'bold',paddingLeft:20 }}>X {record.quanity}</span>
                    </Row>
                )
            }
        },
        { 
            title:"Tạm tính",
            dataIndex:"",
            key:'temp',
            render:(record)=>{
                if(record[0].promotional===null){
                    return <span>{getPriceVND(record[0].price*record.quanity)+" đ"}</span>
                }else{
                    return <span>{getPriceVND(record[0].promotional*record.quanity)+" đ"}</span>
                }
            }
        }
    ]
    const InformationPayment = ()=>(
       <div style={{ padding:20 }}>
           <div style={{ display:'flex',flexDirection:'column' }}>
            {dataSale===undefined &&
                <span >Bạn có mã khuyển mãi? <Link to="/cart">Quay lại</Link> giỏ hàng để nhận được khuyển mãi ! </span>
            }
           </div>
           <h2>THÔNG TIN THANH TOÁN</h2>
            <Form.Item
                name="name"
                label="Họ Tên"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Nhập họ tên"
                    value={name}
                    defaultValue={name}
                    onChange= {(e)=>setname(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item
                name="address"
                label="Địa chỉ"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Nhập địa chỉ"
                    value={address}
                    defaultValue={address}
                    onChange= {(e)=>setaddress(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item
                name="phone"
                label="Số điện thoại"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    defaultValue={phone}
                    onChange= {(e)=>setphone(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item
                name="email"
                label="Địa chỉ Email"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                rules={[
                    { type: 'email',message:"Vui lòng nhập đúng Email"},
                    {required:true,message:"Vui lòng điền Email !"},
                ]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Nhập địa chỉ Email"
                    value={email}
                    defaultValue={email}
                    onChange= {(e)=>setemail(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                    disabled={datauser.id!==undefined}
                />
            </Form.Item>
            <Form.Item
                name= 'introduction'
                label="Ghi chú đơn hàng"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 14 }}
                style={{width:'80%'}}
            >
                <Input.TextArea
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    value={message}
                    defaultValue={message}
                    onChange= {(e)=>setmessage(e.target.value)}
                    maxLength={200}
                    style={{height:200}}
                />
            </Form.Item>
       </div>
    )
    const Payment = ()=>(
        <div style={{ border:"2px solid black",padding:20 }}>
            <h2>ĐƠN HÀNG CỦA BẠN</h2>
            <Table 
                dataSource={dataCart} 
                columns={columns} 
                pagination={false}
                summary={()=>(
                    <Table.Summary>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Tạm tính</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{getPriceVND(totalTmp)+" đ"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                        {dataSale !== undefined &&
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Mã khuyến mãi</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{"-"+getPriceVND(promoprice)+" đ"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                        }
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Phí vận chuyển</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{getPriceVND(30000)+" đ"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}><span style={{fontWeight:'bold'}}>Tổng</span></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{getPriceVND(totalTmp-promoprice+30000)+" đ"}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
            )}/>

            <Radio.Group  
                style={{paddingTop:20}}
                value={methodPayment}
                onChange= {(e)=>setmethodPayment(e.target.value)}
                horizontal
            >
            <Space direction="vertical">
                <Radio value={1}><b>Chuyển khoản ngân hàng</b> <br/>
                    {methodPayment===1 ? <span>{textMethodBank}</span>:null}
                </Radio>
                <Radio value={2}><b>Trả tiền mặt khi nhận hàng</b><br/>
                    {methodPayment===2 ? <span>Trả tiền mặt khi nhận hàng</span>:null}
                 </Radio>
            </Space> 
            </Radio.Group>
            
            <Form.Item style={{ paddingTop:20 }}>
                <Button type="primary" htmlType="submit" danger style={{ height:60,width:120,fontWeight:'bold' }} onClick={()=>console.log(email)}>
                    Đặt hàng
                </Button>
            </Form.Item>
            <div >
            <span >Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng, 
                tăng trải nghiệm sử dụng website, 
                và cho các mục đích cụ thể khác đã được mô tả trong chính sách riêng tư.</span>
            </div>
        </div>
    )
    const Content = ()=>(
        <div>
        {dataCart.length!==undefined ?
            <div>
            {showUser &&
            <Form 
                style={{ padding:"10px 40px" }} 
                onFinish={handleValidationOrder}
                form={form}
                initialValues={{
                    name: name,
                    email: email
                }}
                
            >
                <Row>
                    <Col xl={14} xs={24} >
                        {InformationPayment()}
                    </Col >
                    <Col xl={10} xs={24} >
                        {Payment()}
                    </Col>
                </Row>
            </Form>
            }
            </div>
            :
            <div style={{ height:450,padding:"20px 40px" }}>
            <span style={{ fontWeight:'bold' }}> Hãy thêm sản phẩm vào giỏ hàng để thực hiện chức năng này... </span>
            <div style={{ display:'flex',flex:1,justifyContent:'center',paddingTop:"10%" }}>
                        <Button style={{ height:50 }} type="primary" danger>
                            <Link to="/">
                                Quay trở lại cửa hàng
                            </Link>
                        </Button>
                    </div>
            </div>
        }   
        </div>
    )
    return(
        <div>
            {paymentSucess ? 
            <Result
                style={{ height:450,paddingTop:50 }}
                status="success"
                title="Đặt hàng thành công!"
                subTitle="Theo dõi đơn hàng của bạn ?"
                extra={[
                <Button type="primary">
                    <Link to="/">
                    Tiếp tục đặt sản phẩm
                    </Link>
                </Button>,
                <Button >
                    <Link to="/billfollow">
                    Theo dõi đơn hàng
                    </Link>
                </Button>,
            ]}
          />
            :
            <div>
                {Content()}
            </div>
            }
        </div>
        
    )
} 