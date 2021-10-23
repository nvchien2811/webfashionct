import React ,{useEffect,useState} from 'react';
import { Carousel,Col,Row,Button  } from 'antd';
import slider1 from '../../images/slider1.jpg';
import slider2 from '../../images/slider2.jpg';
import slider3 from '../../images/slider3.jpg';
import '../../css/Home.css';
import Product from '../../elements/product';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import { useLocation } from 'react-router-dom';
export default function Home(){
    const [itemProductNew, setitemProductNew] = useState([]);
    const [itemProductDeal, setitemProductDeal] = useState([]);
    const [showContent, setshowContent] = useState(false);
    const [pageNew, setpageNew] = useState(1);
    const [moreNew, setmoreNew] = useState(true);
    const [pageDeal, setpageDeal] = useState(1);
    const [moreDeal, setmoreDeal] = useState(true);
    const location = useLocation();
    useEffect(()=>{
        setshowContent(false);
        getProductNew();
    },[pageNew])

    useEffect(()=>{
        setshowContent(false);
        getProductDeal();
    },[pageDeal])

    useEffect(()=>{
        window.scroll(0,0);
    },[location])
  
    const getProductNew = async()=>{
        let item = itemProductNew;
        const res = await FetchAPI.getAPI(`/product/getProductNew/${pageNew}`);
        item = item.concat(res.item);
        if(res.msg==="Out of data"){
            setmoreNew(false);
        }
        setitemProductNew(item);
        setshowContent(true);
    }
    const getProductDeal = async()=>{
        let item = itemProductDeal;
        const res = await FetchAPI.getAPI(`/product/getProductDeal/${pageDeal}`);
        item = item.concat(res.item);
        if(res.msg==="Out of data"){
            setmoreDeal(false);
        }
        setitemProductDeal(item);
        setshowContent(true);
    }
    const slide = ()=>(
        <Carousel autoplay >
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
            <Col style={{display:'flex', justifyContent:'center' }} xl={6} md={8} xs={12}>
                <Product
                    item={item}
                />
            </Col>
        )
    })
    const ItemProductDeal = itemProductDeal.map((item)=>{
        return(
            <Col style={{display:'flex', justifyContent:'center' }} xl={6} md={8} xs={12}>
                <Product
                    item={item}
                />
            </Col>
        )
    })
    return(
       <div >
           {showContent ? 
           <div>
           {slide()}
           <div className="contentHome"  >
                <span  style={{ fontSize:20,paddingBottom:20,fontWeight:'bold' }}>
                    SẢN PHẨM MỚI 
                </span>
                <Row gutter={ [{ xs: 8, sm: 16, md: 24, lg: 24 },20]} style={{ width:'100%' }} >
                    {ItemProduct}
                </Row>
                {moreNew &&
                <div style={{ padding:"20px 0px" }}>
                    <Button onClick={()=>setpageNew(pageNew+1)} type="primary"  danger ghost>
                        Xem thêm...
                    </Button>
                </div>
                }
                <span style={{ fontSize:20,paddingBottom:20,fontWeight:'bold',padding:"20px 0px" }}>SẢN PHẨM DEAL HOT</span>
                <Row gutter={ [{ xs: 8, sm: 16, md: 24, lg: 24 },20]} style={{ width:'100%' }} >
                    {ItemProductDeal}
                </Row>
                {moreDeal &&
                <div style={{ padding:"20px 0px" }}>
                    <Button onClick={()=>setpageDeal(pageDeal+1)} type="primary"  danger ghost>
                        Xem thêm...
                    </Button>
                </div>
                }
           </div>
           </div>
           :
           <Spinner spinning={!showContent}/>
            }
       </div>
    )
}