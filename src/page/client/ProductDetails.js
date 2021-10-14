import React,{useState,useEffect} from 'react';
import {Image,Row,Col,Breadcrumb,Rate,InputNumber,Select ,Button,Spin  } from 'antd';
import *as FetchAPI from '../../util/fetchApi';
import {getPriceVND} from '../../contain/getPriceVND';
import {Link} from 'react-router-dom';
import * as MENU from '../../util/menuProduct'
const { Option } = Select;
export default function ProductDetails(){
    const [dataProduct, setdataProduct] = useState();
    const [showContent, setshowContent] = useState(false);
    const [nameCategory, setnameCategory] = useState("");
    const [nameProductType, setnameProductType] = useState("");
    const [quanity, setquanity] = useState(1);
    const [datasize, setdatasize] = useState();
    const [size, setsize] = useState();
    
    useEffect(() => {    
        const getDetailProduct = async()=>{
            try {
                let idProduct = window.location.hash.substring(1);
                getSize(idProduct);
                const data = {
                    "id":idProduct
                }
                const res = await FetchAPI.postDataAPI("/product/getProductDetails",data);
                setdataProduct(res[0]);
                getName(res[0]);
                
            } catch (error) {
            }
        }
        getDetailProduct();
    }, [])

    const getName = async(data)=>{
        const category = await MENU.getCategoryById({"id":data.idCategory});
        const product_type = await MENU.getPrductTypeById({"id":data.idProductType});
        setnameCategory(category.name);
        setnameProductType(product_type.name);
        setshowContent(true);
    }
    const getSize = async(id)=>{
        let i = [];
        const data = {"id":id};
        const res = await FetchAPI.postDataAPI('/product/getProductInventory',data);
        res.map((item)=>(
            i.push(
                <Option value={item.size}>{item.size +"- "}<span style={{ color:'gray' }}>{item.quanity}</span></Option>
            )
        ))
        setdatasize(i);
    }
    const line = ()=>(
        <div style={{ backgroundColor:'gray',height:1,marginTop:10 }}/>
    )
    const ProductInformation = ()=>(
        <div style={{ display:'flex',flexDirection:'column' }}>
            <span style={{ fontSize:18,fontWeight:'bold' }}>{dataProduct.name}</span>   
            <Rate allowHalf style={{ color:"orange"}} tooltips="12345" defaultValue={5} />
            <span><span style={{ fontWeight:'bold' }}>Mã SP :</span>{dataProduct.id}</span>
            <span style={{ fontSize:16 }}>{dataProduct.description}</span>
        </div>
    )
    const contentProduct = ()=>(
        <div style={{ display:'flex',flexDirection:'column' }}>
            {ProductInformation()}
            {line()}

            {dataProduct.promotional===null ?
                <span style={{ fontSize:20 }}>Giá: {getPriceVND(dataProduct.price)+" đ"}</span>
                :
                <div style={{ display:'flex',flexDirection:'column' }}>
                    <span style={{ fontSize:18,textDecorationLine:'line-through' }}>Giá gốc: {getPriceVND(dataProduct.price)+" đ"}</span>
                    <span style={{ fontSize:20,color:'red',fontWeight:'bold' }}>Giá: {getPriceVND(dataProduct.promotional)+" đ"}</span>
                </div>
            }
            {line()}

            <div style={{ display:'flex',flexDirection:'row',alignItems:'center',paddingTop:20,paddingBottom:20 }}>
                <span style={{ fontSize:18 }}>Tùy chọn : </span>
                <div style={{ padding:"0px 10px"}}> 
                  <Select style={{ width: 120 }} placeholder="Chọn Size, Màu" onChange={(e)=>setsize(e)}>
                        {datasize}
                  </Select>
                </div>
            </div>

            <div style={{ display:'flex',flexDirection:'row',alignItems:'center',paddingTop:20,paddingBottom:20 }}>
                <span style={{ fontSize:18 }}>Số lượng : </span>
                <div style={{ padding:"0px 10px"}}> 
                    <InputNumber  
                        style={{ textAlign:'center' }} 
                        min={1} 
                        max={10}
                        value={quanity}
                        onChange = {(e)=>{setquanity(e)}}
                    /> 
                </div>
            </div>

            {line()}
            <div style={{ paddingTop:15 }}>
                <Button type="primary" danger style={{ width:150,height:50,borderRadius:10}}>
                    <span style={{ fontWeight:'bold' }}>MUA HÀNG</span>
                </Button>
            </div>

        </div> 
    )
    const Direction = ()=>(
        <Breadcrumb style={{ fontSize:18 }}>
            <Breadcrumb.Item>
                <Link to={"/home"}>Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to={`/category/id#${dataProduct.idCategory}`}>{nameCategory}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to={`/menuproduct/id#${dataProduct.idProductType}`}>{nameProductType}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{dataProduct.name}</Breadcrumb.Item>
        </Breadcrumb>
    )
    return(
        <div style={{ padding:"20px 10%" }}>
            {showContent ?
            <div>
            <div style={{ paddingBottom:30}}>
                {Direction()}
            </div>       
            <Row  gutter={{ xs: 8, sm: 16, md: 24, lg: 30 }}>
               <Col xl={8} sm={24} style={{ display:'flex',paddingRight:20 }}>
                   <Image src={dataProduct.image} width={350} />
               </Col>
               <Col xl={12} sm={24}>
                    {contentProduct()}
               </Col>
               <Col className="productRelate" xl={4} style={{ justifyContent:'center' }}>
                   <span style={{ fontSize:16,fontWeight:'bold' }}>SẢN PHẨM LIÊN QUAN</span>
               </Col>
            </Row>
            </div>
            :
            <div style={{ width:'100%',height:500 }}>
                <Spin spinning={!showContent} size="large">
                    <div style={{ width:'100%',height:500 }}/>
                </Spin>
            </div>
            }
        </div>
    )
}