import React from 'react';
import {List,Row,Col,Image,Button} from 'antd';
import {getPriceVND} from '../contain/getPriceVND';
import {DeleteOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
export default function dropDownCart(props){
    let {data} = props;
    let total = 0;
    const handleDeleteItem = (item)=>{
        const dataOut = localStorage.getItem("cart");
        let objDataOut = JSON.parse(dataOut);
        if(objDataOut.length===1){
            localStorage.removeItem("cart");
            props.update();
        }else{
            let index = objDataOut.findIndex(x=> x.id===item[0].id && x.option===item.option);
            objDataOut.splice(index, 1);
            localStorage.setItem("cart",JSON.stringify(objDataOut));
            props.update();
        }
    }
    const render = (item)=>{
        return(
           
            <List.Item>
                <Row style={{ width:'100%' }}>
                    <Col span={4}>
                        <Image src={item[0].image} width={60} preview={false}/>
                    </Col>
                    <Col span={18} style={{ paddingLeft:40,display:'flex',flexDirection:'column' }}>
                        <span style={{ fontWeight:'bold' }}>{item[0].name}</span>
                        {item[0].promotional===null ?
                            <span>
                                <span style={{ color:'gray',paddingRight:10 }}>{item.quanity+ "x"}</span>
                                <span style={{ color:'black' }}>{getPriceVND(item[0].price)+" đ"}</span> 
                            </span>
                            :
                            <span>
                                <span style={{ color:'gray',paddingRight:10 }}>{item.quanity+ "x"}</span>
                                <span style={{ color:'black' }}>{getPriceVND(item[0].promotional)+" đ"}</span>
                            </span>
                        }
                        <span>{item.option}</span>
                    </Col>
                    <Col span={2} style={{ justifyContent:'flex-end',alignItems:'center',display:'flex' }}>
                        <DeleteOutlined 
                            style={{fontSize:20,cursor:"pointer"}}
                            onClick={()=>handleDeleteItem(item)}
                        />
                    </Col>
                </Row>
            </List.Item>
        
        )
    }
    if(data.length===undefined || data===null){
        return(
            <div
                style={{
                    backgroundColor:'white',
                    padding:30,
                    boxShadow:"2px 2px 50px #00000026"
                }} 
            >
                <span > Chưa có sản phẩm trong giỏ hàng </span>
            </div>
        )
    }else{
        data.map((item)=>{
            if(item[0].promotional===null){
                total += item[0].price*item.quanity;
            }else{
                total += item[0].promotional*item.quanity;
            } 
            return false; 
        })
        return(
            <div  
                style={{
                    backgroundColor:'white',
                    padding:30,
                    boxShadow:"2px 2px 50px #00000026",
                    width:400
                }}>
                <List 
                    dataSource={data}
                    renderItem={render}
                />
                <div 
                    style={{ fontWeight:'bold',justifyContent:'center',width:'100%',display:'flex',padding:"10px 0px"}}
                >
                    <span style={{ color:'gray' }}>TẠM TÍNH : </span>
                    <span style={{ padding:"0 5px" }}>{getPriceVND(total)+" đ"}</span>
                </div>
                <div>
                    <Button type="primary" style={{ width:'100%',height:40 }}>
                        <Link to="/cart">
                        Xem giỏ hàng
                        </Link>
                    </Button>
                    <Button type="primary" style={{ width:'100%',margin:"10px 0px",height:40 }} danger>
                        <Link to="/payment">
                        Thanh toán
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }
}