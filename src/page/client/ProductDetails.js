import React,{useState,useEffect} from 'react';
import {Image,Row,Col,Breadcrumb,Rate } from 'antd';
import *as FetchAPI from '../../util/fetchApi';
import {getPriceVND} from '../../contain/getPriceVND';
import {Link} from 'react-router-dom';
import * as MENU from '../../util/menuProduct';
export default function ProductDetails(){
    const [dataProduct, setdataProduct] = useState();
    const [showContent, setshowContent] = useState(false);
    const [nameCategory, setnameCategory] = useState("");
    const [nameProductType, setnameProductType] = useState("");
    useEffect(() => {
        getDetailProduct();
    }, [])


    const getDetailProduct = async()=>{
        let idProduct = window.location.hash.substring(1);
        const data = {
            "id":idProduct
        }
        const res = await FetchAPI.postDataAPI("/product/getProductDetails",data);
        setdataProduct(res[0]);
        getName(res[0]);
    }
    const getName = async(data)=>{
        const category = await MENU.getNameCategory({"id":data.idCategory});
        const product_type = await MENU.getNameProductType({"id":data.idProductType});
        setnameCategory(category);
        setnameProductType(product_type);
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
    const Direction = ()=>(
        <Breadcrumb style={{ fontSize:18 }}>
            <Breadcrumb.Item>
                <Link to={"/home"}>Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link >{nameCategory}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to={`/menuproduct/id#${dataProduct.idProductType}`}>{nameProductType}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{dataProduct.name}</Breadcrumb.Item>
        </Breadcrumb>
    )
    return(
        <div style={{  padding:"50px 100px" }}>
            {showContent &&
            <div>
            <div style={{ paddingBottom:30}}>
                {Direction()}
            </div>       
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
            </div>
            }
        </div>
    )
}