import React ,{useEffect,useState} from 'react';
import {Breadcrumb,Col,Row,Empty} from 'antd';
import * as MENU from '../../util/menuProduct';
import {Link,useLocation,useParams} from 'react-router-dom';
import * as FetchAPI from '../../util/fetchApi';
import Product from '../../elements/product';
import Spinner from '../../elements/spinner';
export default function MenuProduct(){
    const [showContent, setshowContent] = useState(false);
    const [nameCategory, setnameCategory] = useState("");
    const [idCategory, setidCategory] = useState();
    const [nameProductType, setnameProductType] = useState("");
    const [dataProduct, setdataProduct] = useState([]);
    const [empty, setempty] = useState(false);
    const {idProductType} = useParams();
    const location = useLocation();
    useEffect(()=>{
        setshowContent(false);
        const getMenu = async()=>{
            try {
                const product_type = await MENU.getPrductTypeById({"id":idProductType});
                setnameProductType(product_type.name)
                setidCategory(product_type.idCategory)
                const category = await MENU.getCategoryById({"id":product_type.idCategory});
                setnameCategory(category.name);
                getDataProduct(idProductType);
            } catch (error) { 
            }
        }
        getMenu()
       
    },[location])
  
    const getDataProduct = async(id)=>{
        const data = {"id":id};
        const product = await FetchAPI.postDataAPI('/product/getProductByType',data);
        setdataProduct(product);
        if(product.length===0){
            setempty(true)
        }else{
            setempty(false)
        }
        setshowContent(true);
    }
    const Direction = ()=>(
        <Breadcrumb style={{ fontSize:18,paddingBottom:20 }}>
            <Breadcrumb.Item>
                <Link to={"/home"}>Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to={`/category/${idCategory}`}>{nameCategory}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
               {nameProductType}
            </Breadcrumb.Item>
        </Breadcrumb>
    )
    const ItemProduct = dataProduct.map((item)=>{
        return(
            <Col xl={6} lg={8} md={12} sm={12} xs={24} style={{display:'flex', justifyContent:'center' }} >
                <Product
                    item={item}
                />
            </Col>
        )
    })
    return(
        <div className="wrapper-menu-product">
        {showContent ?
        <div>
            <div>
                {Direction()}
            </div>
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
          :
            <Spinner spinning={!showContent}/>
        }

        </div>
    )
}