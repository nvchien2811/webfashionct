import React,{useEffect,useState} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import {Table,Select,Button,Drawer,Form,Input} from 'antd';
import Spinner from '../../elements/spinner';
import {EditOutlined,DeleteOutlined} from '@ant-design/icons';
import {useSelector} from 'react-redux';
const {Option} = Select;
export default function ManageProductType(){
    const [dataFullProductType, setdataFullProductType] = useState();
    const [showContent, setshowContent] = useState(false);
    const [optionCategory, setoptionCategory] = useState();
    const [drawerEdit, setdrawerEdit] = useState(false);
    const [itemTmp, setitemTmp] = useState({});
    const [dataFullProduct, setdataFullProduct] = useState();
    const [formEdit] = Form.useForm();
    const [loadingBtn, setloadingBtn] = useState(false);
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);
    useEffect(()=>{
        setshowContent(false);
        getProductType()
    },[])
    const getProductType = async()=>{
        const product_type = await FetchAPI.getAPI('/product/getProductType');
        const category = await FetchAPI.getAPI('/product/getCategory');
        const product = await FetchAPI.getAPI('/product/getFullProduct');
        let arrTmp = [];
        category.map((item,index)=>{
            arrTmp.push(
                <Option value={item.id}>{item.name}</Option>
            )
            if(index===category.length-1){
                setoptionCategory(arrTmp)
            }
        })
        setdataFullProductType(product_type);
        setdataFullProduct(product);
        setshowContent(true)
    }
    const handleEditProductType = async()=>{
        console.log(itemTmp)
    }
    const columns = [
        {
            title:"Mã loại sản phẩm",
            name:"id",
            render: record=><span style={{fontWeight:'bold'}}>{"#"+record.id}</span>
        },
        {
            title:"Tên loại sản phẩm",
            name:"name",
            render: record=><span>{record.name}</span>
        },
        {
            title:"Số sản phẩm danh mục",
            name:"product",
            render:record=>{
                let i = 0;
                dataFullProduct.map((e)=>{
                    if(e.idProductType===record.id){
                        i++
                    }
                })
                return (<span>{i+" sản phẩm"}</span>)
            }
        },
        {
            title:"Danh mục sản phẩm",
            name:"nameCategory",
            render: record=>(
                <span>{record.nameCategory}</span>
            )
        },
        {
            title:"Trạng thái",
            name:"status",
            render: record=>{
                if(record.status===0){
                    return <span>Hiển thị</span>
                }else{
                    return <span>Ẩn</span>
                }
            }
        },
        {
            title:"Tùy chỉnh",
            name:"option",
            render: record=>{
                return(
                    <div style={{ display:'flex',flexDirection:'row' }}>
                        <Button 
                            type="primary" 
                            style={{ borderRadius:10 }}
                            onClick={()=>{
                                setdrawerEdit(true);
                                setitemTmp(record);
                                formEdit.setFieldsValue(record);
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
    const DrawerEdit = ()=>(
        <Drawer
            title="Chỉnh sửa loại sản phẩm"
            visible={drawerEdit}
            width={overflowX ?"100%":520}
            onClose={()=>setdrawerEdit(false)}
        >
            <Form
              form={formEdit}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
              onFinish={handleEditProductType}
            >
                <Form.Item
                    label="Tên loại sản phẩm"
                    name="name"
                >
                    <Input
                        placeholder="Nhập tên loại sản phẩm"
                        value={itemTmp.name}
                        onChange= {(e)=>itemTmp.name=e.target.value}
                    /> 
                </Form.Item>
                <Form.Item
                    label="Danh mục sản phẩm"
                    name="idCategory"
                >
                    <Select
                        value={itemTmp.idCategory}
                        onChange= {(e)=>itemTmp.idCategory=e}
                    >
                        {optionCategory}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Trạng thái"
                    name="status"
                >
                    <Select
                        value={itemTmp.status}
                        onChange= {(e)=>itemTmp.status=e}
                    >
                        <Option value={0}>
                            Hiển thị
                        </Option>
                        <Option value={1}>
                            Ẩn
                        </Option>

                    </Select>
                </Form.Item>
                <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                    <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
    return(
        <div>
            {showContent ?
            <div>
                <Table 
                    columns={columns}
                    dataSource={dataFullProductType}
                />
                {DrawerEdit()}
            </div>            
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}