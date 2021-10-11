import React,{useState,useEffect} from 'react';
import {Image,Row,Col} from 'antd';
import *as FetchAPI from '../../util/fetchApi';
import { Rate } from 'antd';
import {getPriceVND} from '../../contain/getPriceVND';
export default function ProductDetails(){
    const [dataProduct, setdataProduct] = useState();
    const [showContent, setshowContent] = useState(false);
    useEffect(() => {
        getDetailProduct();
    }, [])


    const getDetailProduct = async()=>{
        let idProduct = window.location.hash.substring(1);
        const data = {
            "id":idProduct
        }
        const res = await FetchAPI.postDataAPI("/product/getProductDetails",data);
        console.log("234")
        setdataProduct(res[0]);
        setshowContent(true);
    }
    const contentProduct = ()=>(
        <div style={{ display:'flex',flexDirection:'column' }}>
            <span style={{ fontSize:18,fontWeight:'bold' }}>{dataProduct.name}</span>   
            <Rate allowHalf style={{ color:"orange"}} tooltips="12345" defaultValue={5} />
            <span><span style={{ fontWeight:'bold' }}>Mã SP :</span>{dataProduct.id}</span>
            <span style={{ fontSize:16 }}>{dataProduct.description}</span>
            <div style={{ backgroundColor:'gray',height:1,marginTop:10,marginBottom:10 }}/>
            <span style={{ fontSize:20 }}>Giá: {getPriceVND(dataProduct.price)+" đ"}</span>
            <div style={{ backgroundColor:'gray',height:1,marginTop:10 }}/>
        </div> 
    )
    return(
        <div style={{  padding:"50px 100px" }}>
            {showContent &&
            <Row>
               <Col xl={8} sm={24} style={{ display:'flex',justifyContent:'center',paddingRight:20 }}>
                   <Image src={dataProduct.image} width={350} />
               </Col>
               <Col xl={12} sm={24}>
                    {contentProduct()}
               </Col>
               <Col className="productRelate" xl={4} >
                   <span style={{ fontSize:18,fontWeight:'bold' }}>SẢN PHẨM LIÊN QUAN</span>
               </Col>
            </Row>
            }
        </div>
    )
}