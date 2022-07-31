import React,{useEffect,useState} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {Row,Col,Pagination,Breadcrumb} from 'antd';
import Product from '../../elements/product';
import { useParams,useHistory,useLocation,Link } from 'react-router-dom';
import FilterProduct from '../../elements/FilterProduct';
export default function ProductSale (){
    const [showContent, setshowContent] = useState(false);
    const [totalProduct, settotalProduct] = useState();
    const [dataShow, setdataShow] = useState([]);
    const PageSize = 8;
    const {page} = useParams();
    const history = useHistory();
    const location = useLocation();
    const [currentKeyFilter, setcurrentKeyFilter] = useState();

    useEffect(()=>{
        setshowContent(false);
        window.scroll(0,0);
        getProductSale()
    },[location])
    const getProductSale = async()=>{
        let arrTmp = []
        const res = await FetchAPI.getAPI("/product/getproductSale");
        res.map((item,index)=>{
            if(index<PageSize*page&&index>=PageSize*(page-1)){
                arrTmp.push(item)
            }
        })
        setdataShow(arrTmp);
        settotalProduct(res.length)
        setshowContent(true)
    }
  
    const ItemProduct = dataShow.map((item)=>{
        return(
            <Col style={{display:'flex', justifyContent:'center' }} xl={6} md={8} xs={12}>
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
                 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:20 }}>
                 <Breadcrumb style={{ fontSize:18,padding:"20px 20px"}}>
                    <Breadcrumb.Item>
                        <Link to={"/home"}>Trang chủ</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={"/fullproduct/1"}>Cửa hàng</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {`Sản phẩm khuyến mãi`}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ paddingRight:20 }}>
                    <FilterProduct 
                        currentKey={currentKeyFilter}
                        setCurrentKey={(e)=>setcurrentKeyFilter(e)}
                        data = {dataShow}
                        replaceData = {e=>setdataShow(e)}
                    />
                </div>
                </div>
                <Row gutter={ [{ xs: 8, sm: 16, md: 24, lg: 24 },20]} style={{ width:'100%' }} >
                    {ItemProduct}
                </Row>
                <div style={{ justifyContent:'center',display:'flex',paddingTop:20 }}>
                <Pagination 
                    defaultPageSize={PageSize} 
                    defaultCurrent={page} 
                    total={totalProduct} 
                    onChange= {(e)=>history.push(`/productsale/${e}`)}
                />
                </div>
            </div>
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}