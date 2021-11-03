import React,{useEffect,useState,useRef} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import {Table,Select,Button,Drawer,Form,Input,message,Modal} from 'antd';
import Spinner from '../../elements/spinner';
import {EditOutlined,DeleteOutlined,PlusCircleOutlined} from '@ant-design/icons';
import {useSelector} from 'react-redux';
import {getColumnSearchProps} from '../../elements/SearchFilter';
const {Option} = Select;
export default function ManageProductType(){
    const [dataFullProductType, setdataFullProductType] = useState();
    const [showContent, setshowContent] = useState(false);
    const [optionCategory, setoptionCategory] = useState();
    const [drawerEdit, setdrawerEdit] = useState(false);
    const [showModalAdd, setshowModalAdd] = useState(false);
    const [itemTmp, setitemTmp] = useState({});
    const [dataAdd, setdataAdd] = useState({});
    const [dataFullProduct, setdataFullProduct] = useState();
    const [formEdit] = Form.useForm();
    const [formAdd] = Form.useForm();
    const [loadingBtn, setloadingBtn] = useState(false);
    const searchInput = useRef();
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
        setloadingBtn(true);
        const data = {"data":itemTmp};
        const res = await FetchAPI.postDataAPI("/product/editProductType",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Cập nhật thành công");
                getProductType();
                setloadingBtn(false)
            }else{
                message.error("Có lỗi rồi !!")
                setloadingBtn(false)
            }
        }
    }
    const handleAddProductType = async()=>{
        setloadingBtn(true);
        const data = {"data":dataAdd};
        const res = await FetchAPI.postDataAPI("/product/addProducType",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Thêm mới thành công");
                getProductType();
                setshowModalAdd(false);
                setdataAdd({});
                formAdd.setFieldsValue({name:"",idCategory:null,status:null})
                setloadingBtn(false);
            }else{
                message.error("Có lỗi rồi !!")
                setloadingBtn(false)
            }
        }
    }
    const columns = [
        {
            title:"Mã loại sản phẩm",
            name:"id",
            render: record=><span>{"#"+record.id}</span>
        },
        {
            title:"Tên loại sản phẩm",
            name:"name",
            ...getColumnSearchProps('name',searchInput),
            // render: record=><span>{record.name}</span>
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
                    <Button type="primary" danger style={{ borderRadius:10,marginLeft:20 }}>
                            <DeleteOutlined />
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    )
    const ModalAddNew = ()=>(
        <Modal
            title="Thêm mới loại sản phẩm"
            visible={showModalAdd}
            onCancel={()=>setshowModalAdd(false)}
            footer={false}
        >
            <Form
                form={formAdd}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                onFinish={handleAddProductType}
            >
                <Form.Item
                    label="Tên loại sản phẩm"
                    name="name"
                    rules={[{ required: true, message: 'Nhập tên loại sản phẩm'}]}
                >
                    <Input
                        placeholder="Nhập tên loại sản phẩm"
                        value={dataAdd.name}
                        onChange= {(e)=>setdataAdd({...dataAdd,name:e.target.value})}
                    /> 
                </Form.Item>
                <Form.Item
                    label="Danh mục sản phẩm"
                    name="idCategory"
                    rules={[{ required: true, message: 'Chọn danh mục sản phẩm'}]}
                >
                    <Select
                        value={dataAdd.idCategory}
                        onChange= {(e)=>setdataAdd({...dataAdd,idCategory:e})}
                    >
                        {optionCategory}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: 'Chọn trạng thái'}]}
                >
                    <Select
                        value={dataAdd.status}
                        onChange= {(e)=>setdataAdd({...dataAdd,status:e})}
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
                       Thêm mới
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
    return(
        <div>
            {showContent ?
            <div>
            <Button type="primary" style={{ marginBottom:20 }} danger onClick={()=>setshowModalAdd(true)}>
                Thêm mới <PlusCircleOutlined />
            </Button>
            <div>
                <Table 
                    columns={columns}
                    dataSource={dataFullProductType}
                    style={overflowX?{overflowX:'scroll'}:null} 
                />
                {DrawerEdit()}
                {ModalAddNew()}
            </div>      
            </div>      
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}