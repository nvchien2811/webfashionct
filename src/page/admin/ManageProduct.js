import React,{useEffect,useState} from 'react';
import { useLocation } from 'react-router-dom';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {Image,Table,Button,Drawer} from 'antd';
import {EditOutlined,DeleteOutlined} from '@ant-design/icons';
export default function ManageProduct(){
    const location = useLocation();
    const [showContent, setshowContent] = useState(false);
    const [drawerEdit, setdrawerEdit] = useState(false);
    const [itemProductTmp, setitemProductTmp] = useState();
    const [dataProduct, setdataProduct] = useState();
    useEffect(()=>{
        setshowContent(false);
        getFullProduct();
    },[location])
    const getFullProduct = async()=>{
        const product = await FetchAPI.getAPI('/product/getFullProductAdmin');
        setshowContent(true);
        setdataProduct(product)
    }
    const columns  = [
        {
            title:"Mã sản phẩm",
            key:'id',
            render: record=><span style={{fontWeight:'bold'}}>{record.id}</span>
        },
        {
            title:"Tên sản phẩm",
            key:'name',
            render: record=><span>{record.name}</span>
        },
        {
            title:"Hình ảnh",
            key:'image',
            render: record=><Image src={record.image} width={80}/>
        },
        {
            title:"Danh mục sản phẩm",
            key:'category',
            render: record=>
            <div style={{ textAlign: 'center'}}>
                <span >{record.nameCategory}</span>
            </div>
        },
        {
            title:"Loại sản phẩm",
            key:'product_type',
            render:record=><span>{record.nameProductType}</span>
        },
        {
            title:"Trạng thái",
            key:'status',
            render: record=>{
                if(record.status===0){
                    return <span>Hiển thị</span>
                }else{
                    return <span>Ẩn</span>
                }
            }
        },
        {
            title:"Chỉnh sửa",
            key:'edit',
            render: record=>{
                return(
                    <div style={{ display:'flex',flexDirection:'row' }}>
                        <Button 
                            type="primary" 
                            style={{ borderRadius:10 }}
                            onClick={()=>{
                                setdrawerEdit(true);
                                setitemProductTmp(record)
                            }}
                        >
                            <EditOutlined />
                        </Button>
                        <Button type="primary" danger style={{ borderRadius:10,marginLeft:20 }}>
                            <DeleteOutlined />
                        </Button>
                    </div>
                )
            }
        }
    ]
    const DrawerEditProduct = ()=>(
        <Drawer
            title="Chỉnh sửa sản phẩm" 
            placement="right" 
            onClose={()=>setdrawerEdit(false)} 
            visible={drawerEdit}
        >
            {itemProductTmp !==undefined &&
             <p>{itemProductTmp.name}</p>
            }
           
        </Drawer>
    )
    return(
        <div>
        {showContent ? 
            <div>
                <Table 
                    dataSource={dataProduct} 
                    columns={columns}
                    pagination={{ defaultPageSize:5 }}
                />
                {DrawerEditProduct()}
               
            </div>

            :
            <Spinner spinning={!showContent}/>
        }
        </div>
    )
}