import React ,{useEffect,useState} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import {Pagination,Col,Row,Breadcrumb} from 'antd';
import Product from '../../elements/product';
import { useParams,useHistory,useLocation,Link } from 'react-router-dom';
import Spinner from '../../elements/spinner';
export default function FullProduct(){
    const [showContent, setshowContent] = useState(false);
    const [dataProduct, setdataProduct] = useState([]);
    const [totalProduct, settotalProduct] = useState();
    const PageSize = 8;
    const {page} = useParams();
    const history = useHistory();
    const location = useLocation();
    useEffect(()=>{
        window.scroll(0,0)
        getFullProduct();
    },[location])
    const getFullProduct = async()=>{
        setshowContent(false)
        let arrTmp = []
        const res = await FetchAPI.getAPI("/product/getFullProduct");
        res.map((item,index)=>{
            if(index<PageSize*page&&index>=PageSize*(page-1)){
                arrTmp.push(item)
            }
        })
        setdataProduct(arrTmp)
        settotalProduct(res.length)
        setshowContent(true)
    }
    const ItemProduct = dataProduct.map((item)=>{
        return(
            <Col style={{display:'flex', justifyContent:'center' }} xl={6} lg={8} md={12} sm={12} xs={24}>
                <Product
                    item={item}
                />
            </Col>
        )
    })
    return(
        <div style={{ minHeight:450 }}>
            {showContent ?
            <div style={{ padding:"20px 0px" }}>
                <Breadcrumb style={{ fontSize:18,padding:"20px 20px"}}>
                    <Breadcrumb.Item>
                        <Link to={"/home"}>Trang chủ</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {`Cửa hàng`}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Row gutter={ [{ xs: 8, sm: 16, md: 24, lg: 24 },20]} style={{ width:'100%' }} >
                        {ItemProduct}
                </Row>
                <div style={{ justifyContent:'center',display:'flex',paddingTop:20 }}>
                <Pagination 
                    defaultPageSize={PageSize} 
                    defaultCurrent={page} 
                    total={totalProduct} 
                    onChange= {(e)=>history.push(`/fullproduct/${e}`)}
                />
                </div>
            </div>
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}