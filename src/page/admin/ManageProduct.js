import React,{useEffect,useState,useRef,useLayoutEffect} from 'react';
import { useLocation } from 'react-router-dom';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {Image,Table,Button,Drawer} from 'antd';
import {EditOutlined,DeleteOutlined,} from '@ant-design/icons';
import PreviewImmage from '../../elements/PreviewImmage';
import {getColumnSearchProps} from '../../elements/SearchFilter';
export default function ManageProduct(){
    const location = useLocation();
    const [showContent, setshowContent] = useState(false);
    const [drawerEdit, setdrawerEdit] = useState(false);
    const [itemProductTmp, setitemProductTmp] = useState();
    const [dataProduct, setdataProduct] = useState();
    const [filterCategory, setfilterCategory] = useState();
    const [filterProductType, setfilterProductType] = useState();
    const searchInput = useRef();
    const [overflowX, setoverflowX] = useState(false);

    useLayoutEffect(() => {
        function updateSize() {
            if(window.innerWidth<700){
                setoverflowX(true);
            }else{
                setoverflowX(false);
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize();
    }, []);

    useEffect(()=>{
        setshowContent(false);
        getFullProduct();
    },[location])
    const getFullProduct = async()=>{
        let arrTmpCateGory = [];
        let arrTmpProductType = [];
        const product = await FetchAPI.getAPI('/product/getFullProductAdmin');
        product.map((item,index)=>{
            const posCategory = arrTmpCateGory.findIndex(x=>x.value===item.idCategory);
            const posProductType = arrTmpProductType.findIndex(x=>x.value===item.idProductType)
            if(posCategory===-1){
                arrTmpCateGory.push({text:item.nameCategory,value:item.idCategory})
            }
            if(posProductType===-1){
                arrTmpProductType.push({text:item.nameProductType,value:item.idProductType})
            }
            if(index===product.length-1){
                console.log(arrTmpCateGory)
                setfilterCategory(arrTmpCateGory)
                setfilterProductType(arrTmpProductType)
            }
        })
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
            ...getColumnSearchProps('name',searchInput)
            // render: record=><span>{record.name}</span>
        },
        {
            title:"Hình ảnh",
            key:'image',
            render: record=><Image src={record.image} width={80} preview={{ mask:(<PreviewImmage small={true}/>)}}/>
        },
        {
            title:"Danh mục sản phẩm",
            key:'category',
            filters:filterCategory,
            onFilter: (value, record) =>record.idCategory===value,
            render: record=>
            <div style={{ textAlign: 'center'}}>
                <span >{record.nameCategory}</span>
            </div>
        },
        {
            title:"Loại sản phẩm",
            key:'product_type',
            filters:filterProductType,
            onFilter: (value, record) =>record.idProductType===value,
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
                    
                    showSorterTooltip={{ title: 'Nhấn để sắp xếp' }}
                    dataSource={dataProduct} 
                    columns={columns}
                    pagination={{ defaultPageSize:5 }}
                    style={overflowX?{overflowX:'scroll'}:null} 
                />
                {DrawerEditProduct()}
               
            </div>

            :
            <Spinner spinning={!showContent}/>
        }
        </div>
    )
}