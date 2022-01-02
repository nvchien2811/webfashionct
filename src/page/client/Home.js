import React ,{useEffect,useState} from 'react';
import { Carousel,Col,Row,Button  } from 'antd';
import slider1 from '../../images/slider1.jpg';
import slider2 from '../../images/slider2.jpg';
import slider3 from '../../images/slider3.jpg';
import Product from '../../elements/product';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import { useLocation } from 'react-router-dom';
import {BulbFilled,FormatPainterFilled,CompassFilled,ToolFilled} from '@ant-design/icons';
import Slider from "react-slick";

export default function Home(){
    const [itemProductNew, setitemProductNew] = useState([]);
    const [itemProductDeal, setitemProductDeal] = useState([]);
    const [showContent, setshowContent] = useState(false);
    const [pageDeal, setpageDeal] = useState(1);
    const [moreDeal, setmoreDeal] = useState(true);
    const location = useLocation();
    var settings_carsoule_new = {
        dots: true,
        infinite: true,
        arrows:false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1240,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 990,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
    };
    useEffect(()=>{
        setshowContent(false);
        getProductNew();
    },[])

    useEffect(()=>{
        setshowContent(false);
        getProductDeal();
    },[pageDeal])

    useEffect(()=>{
        window.scroll(0,0);
    },[location])
  
    const getProductNew = async()=>{
        const res = await FetchAPI.getAPI(`/product/getProductNew/1`);
        setitemProductNew(res.item);
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
        <Carousel style={{ overflow:"hidden" }} autoplaySpeed={3000} autoplay dots={false}>
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
    const ItemProductDeal = itemProductDeal.map((item)=>{
        return(
            <Col style={{display:'flex', justifyContent:'center' }} xl={6} lg={8} md={12} sm={12} xs={24}>
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

                <span className="title-list"  style={{ fontSize:20,paddingBottom:40,fontWeight:'bold' }}>
                    SẢN PHẨM MỚI 
                </span>
                <Slider className="slider-item-new" {...settings_carsoule_new}>
                {itemProductNew.map(item=>(
                    <div class="hello">
                        <Product 
                            item={item}
                        />
                    </div>
                ))}
                </Slider>

                <span className="title-list" style={{ fontSize:20,paddingBottom:40,fontWeight:'bold',padding:"20px 0px" }}>SẢN PHẨM DEAL HOT</span>
                <Row gutter={ [{ xs: 8, sm: 16, md: 24, lg: 24 },20]} style={{ width:'100%' }} >
                    {ItemProductDeal}
                </Row>
                {moreDeal &&
                <div style={{ padding:"20px 0px",width:"100%",justifyContent:'center',display:'flex' }}>
                    <Button className="btn-loadmore" onClick={()=>setpageDeal(pageDeal+1)} type="primary"  danger ghost>
                        Xem thêm...
                    </Button>
                </div>
                }
                
                <span className="title-list" style={{ fontSize:20,paddingBottom:40,fontWeight:'bold' }}>
                    HÃY CHỌN CTFASHION
                </span>
                <Row className="reason-choose">
                    <Col className="item" xl={6} md={12} sm={24}>
                        <div className="image">
                            <div className="img style1">
                                <CompassFilled />
                            </div>
                        </div>
                        <h2>Giao hàng toàn quốc</h2>
                        <span>Giao hàng vô cùng nhanh với chỉ 30.000đ.</span>
                    </Col>
                    <Col className="item" xl={6} md={12} sm={24}>
                        <div className="image">
                            <div className="img style2">
                                <FormatPainterFilled />
                            </div>
                        </div>
                        <h2>Sản phẩm đa dạng</h2>
                        <span>Áo, quần, phụ kiện các loại luôn chờ đón bạn.</span>
                    </Col>
                    <Col className="item" xl={6}  md={12} sm={24}>
                        <div className="image">
                            <div className="img style3">
                                <BulbFilled />
                            </div>
                        </div>
                        <h2>Tiện ích</h2>
                        <span>Bạn có thể theo dõi đơn hàng của mình mọi lúc.</span>
                    </Col>
                    <Col className="item" xl={6}  md={12} sm={24}>
                        <div className="image">
                            <div className="img style4">
                                <ToolFilled />
                            </div>
                        </div>
                        <h2>Hỗ trợ mua hàng trên nhiều nền tảng</h2>
                        <span>Chúng tôi có website, ứng dụng di động để bạn có thể dễ dàng kết nối.</span>
                    </Col>
                </Row>
           </div>
           </div>
           :
           <Spinner spinning={!showContent}/>
            }
       </div>
    )
}