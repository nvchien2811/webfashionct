import React,{useEffect,useState} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import {Table} from 'antd';
import Spinner from '../../elements/spinner';
export default function ManageCategory(){
    const [dataFullCategory, setdataFullCategory] = useState();
    const [showContent, setshowContent] = useState(false);
    const [dataFullProduct, setdataFullProduct] = useState();
    useEffect(()=>{
        setshowContent(false);
        getCategory()
    },[])
    const getCategory = async()=>{
        const res = await FetchAPI.getAPI('/product/getCategory');
        const product = await FetchAPI.getAPI('/product/getFullProduct');
        setdataFullCategory(res)
        setdataFullProduct(product);
        setshowContent(true)
    }
    const columns = [
        {
            title:"Mã danh mục",
            name:"id",
            render: record=><span style={{fontWeight:'bold'}}>{"#"+record.id}</span>
        },
        {
            title:"Tên danh mục",
            name:"name",
            render: record=><span>{record.name}</span>
        },
        {
            title:"Số sản phẩm danh mục",
            name:"product",
            render:record=>{
                let i = 0;
                dataFullProduct.map((e)=>{
                    if(e.idCategory===record.id){
                        i++
                    }
                })
                return (<span>{i+" sản phẩm"}</span>)
            }
        }
    ]
    return(
        <div>
            {showContent ?
            <div>
                <Table 
                    columns={columns}
                    dataSource={dataFullCategory}
                />
            </div>            
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}