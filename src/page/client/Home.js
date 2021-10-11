import React ,{useEffect,useState} from 'react';
import { Carousel,Col,Row } from 'antd';
import slider1 from '../../images/slider1.jpg';
import slider2 from '../../images/slider2.jpg';
import slider3 from '../../images/slider3.jpg';
import '../../css/Home.css';
import Product from '../../elements/product';
import * as FetchAPI from '../../util/fetchApi';
export default function Home(){
    const [itemProductNew, setitemProductNew] = useState([]);
    useEffect(()=>{
        getProductNew()
    },[])
    const getProductNew = async()=>{
        const res = await FetchAPI.getAPI("/product/getProduct");
        setitemProductNew(res);
    }
    const slide = ()=>(
        <Carousel autoplay>
            <div >
                <img className="imgCarousel" src={slider1} alt="slider1"  />
            </div>
            <div>
                <img  className="imgCarousel" src={slider2} alt="slider2" />
            </div>
            <div>
                <img  className="imgCarousel" src={slider3} alt="slider3"/>
            </div>
        </Carousel>
    )
    const ItemProduct = itemProductNew.map((item)=>{
        return(
            <Col xl={6} md={8} xs={12} style={{display:'flex', justifyContent:'center' }} >
                <Product
                    item={item}
                />
            </Col>
        )
    })
    return(
       <div>
           {slide()}
           <div className="contentHome" >
              <span  style={{ fontSize:20,paddingBottom:20,fontWeight:'bold' }}>SẢN PHẨM MỚI</span>
              <Row  gutter={ [{ xs: 8, sm: 16, md: 24, lg: 50 },12]} >
                  {ItemProduct}
              </Row>
              <span  style={{ fontSize:20,paddingBottom:20,fontWeight:'bold' }}>SẢN PHẨM BÁN CHẠY</span>
              <Row gutter={ [{ xs: 8, sm: 16, md: 24, lg: 50 },12]} >
                  {ItemProduct}
              </Row>
           </div>
       </div>
    )
}