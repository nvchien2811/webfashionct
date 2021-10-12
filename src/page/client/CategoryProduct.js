import React ,{useEffect,useState} from 'react';
import * as MENU from '../../util/menuProduct';
import * as FetchAPI from '../../util/fetchApi';
import {useLocation,Link} from 'react-router-dom';
import {Row,Col,Empty,Breadcrumb} from 'antd';
import Product from '../../elements/product';
export default function CategoryProduct(){
    const [dataProduct, setdataProduct] = useState([]);
    const [showContent, setshowContent] = useState(false);
    const [nameCategory, setnameCategory] = useState("");
    const [empty, setempty] = useState(false);
    const location = useLocation();
    useEffect(()=>{
        getCategory()
    },[location])
    const getCategory = async()=>{
        const idCategory = window.location.hash.substring(1);
        const category = await MENU.getCategoryById({"id":idCategory});
        setnameCategory(category.name);
        const data = {"id":category.id}
        const product = await FetchAPI.postDataAPI('/product/getProductByCategory',data);
        if(product.length===0){
            setempty(true)
        }else{
            setempty(false)
        }
        setdataProduct(product);
        setshowContent(true);
    }
    const ItemProduct = dataProduct.map((item)=>{
        return(
            <Col xl={6} md={8} xs={12} style={{display:'flex', justifyContent:'center' }} >
                <Product
                    item={item}
                />
            </Col>
        )
    })
    const Direction = ()=>(
        <Breadcrumb style={{ fontSize:18,paddingBottom:20 }}>
            <Breadcrumb.Item>
                <Link to={"/home"}>Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
               {nameCategory}
            </Breadcrumb.Item>
        </Breadcrumb>
    )
    return(
        <div style={{ padding:"50px 100px" }}>
            <div>
                {Direction()}
            </div>
            {showContent &&
                <div>
                {empty ?
                    <Empty className="empty" description="Không có sản phẩm"  />
                    :
                    <div>
                        <Row  gutter={ [{ xs: 160, sm: 16, md: 24, lg: 50 },12]} >
                            {ItemProduct}
                        </Row>
                    </div>
                }
                </div>
            }
        </div>
    )
}