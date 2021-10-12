import React ,{useEffect,useState} from 'react';
import {Breadcrumb} from 'antd';
import * as MENU from '../../util/menuProduct';
import {Link} from 'react-router-dom';
import * as FetchAPI from '../../util/fetchApi';
export default function MenuProduct(){
    const [showContent, setshowContent] = useState(false);
    const [nameCategory, setnameCategory] = useState("");
    const [nameProductType, setnameProductType] = useState("");
    useEffect(()=>{
        const getMenu = async()=>{
            const idProductType = window.location.hash.substring(1); 
            const product_type = await MENU.getPrductTypeById({"id":idProductType});
            setnameProductType(product_type.name)
            const category = await MENU.getCategoryById({"id":product_type.id})
            setnameCategory(category.name)
            getDataProduct(idProductType);
        }
        getMenu()
    },[])
  
    const getDataProduct = async(id)=>{
        const data = {"id":id};
        const product = await FetchAPI.postDataAPI('/product/getProductByType',data);
        console.log(product);
        setshowContent(true);
    }
    const Direction = ()=>(
        <Breadcrumb style={{ fontSize:18 }}>
            <Breadcrumb.Item>
                <Link to={"/home"}>Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link >{nameCategory}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
               {nameProductType}
            </Breadcrumb.Item>
        </Breadcrumb>
    )
    return(
        <div style={{ padding:"50px 100px" }}>
        {showContent &&
            <div>
                {Direction()}
            </div>
        }

        </div>
    )
}