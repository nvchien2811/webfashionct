import React,{useEffect,useState,useRef,useLayoutEffect} from 'react';
import { useLocation } from 'react-router-dom';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {Image,Table,Button,Drawer,Form,Input,Select,InputNumber,Upload,message,Modal} from 'antd';
import {EditOutlined,DeleteOutlined,UploadOutlined} from '@ant-design/icons';
import PreviewImmage from '../../elements/PreviewImmage';
import {getColumnSearchProps} from '../../elements/SearchFilter';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyCustomUploadAdapterPlugin from '../../contain/uploadImageDescriprption';
import ImgCrop from 'antd-img-crop';
import { useSelector } from 'react-redux';

const {Option} = Select;
export default function ManageProduct(){
    const location = useLocation();
    const [showContent, setshowContent] = useState(false);
    const [drawerEdit, setdrawerEdit] = useState(false);
    const [itemProductTmp, setitemProductTmp] = useState();
    const [dataProduct, setdataProduct] = useState();
    const [filterCategory, setfilterCategory] = useState();
    const [filterProductType, setfilterProductType] = useState();
    const searchInput = useRef();
    const [formEdit] = Form.useForm();
    const [optionCategory, setoptionCategory] = useState();
    const [optionFullProductType, setoptionFullProductType] = useState();
    const [optionProductType, setoptionProductType] = useState();
    const [loadingBtn, setloadingBtn] = useState(false);
    const [loadingTable, setloadingTable] = useState(false);
    const [showModalDeleteProduct, setshowModalDeleteProduct] = useState(false);
    const [imageListUp, setimageListUp] = useState([]);
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);

    useEffect(()=>{
        setshowContent(false);
        getFullProduct();
    },[location])

    useEffect(async()=>{
        let arrTmpCateGory = [];
        let arrTmpProductType = [];
        const category = await FetchAPI.getAPI('/product/getCategory');
        const productType = await FetchAPI.getAPI('/product/getProductType');
        category.map((item,index)=>{
            arrTmpCateGory.push(
                <Option value={item.id}>{item.name}</Option>
            )
            if(index===category.length-1){
                setoptionCategory(arrTmpCateGory)
            }
        });
        productType.map((item,index)=>{
            arrTmpProductType.push(
                <Option value={[item.name,item.id,item.idCategory]}>{item.name}</Option>
            )
            if(index===productType.length-1){
                setoptionFullProductType(arrTmpProductType)
            }
        })
    },[])
    useLayoutEffect(() => {
        if(itemProductTmp!==undefined)
            filterOption(itemProductTmp.idCategory,true);
    },[drawerEdit])
    
    const filterOption = (value,init)=>{
        let arrTmp = optionFullProductType;
        arrTmp = arrTmp.filter(e=>e.props.value[2]===value);
        setoptionProductType(arrTmp)
        if(!init){
            formEdit.setFieldsValue({nameProductType:null})
        }  
    }
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
                setfilterCategory(arrTmpCateGory)
                setfilterProductType(arrTmpProductType)
            }
        })
        setshowContent(true);
        setdataProduct(product)
    }
    const handleEditProduct = async()=>{
        setloadingBtn(true);
        const data = {"data":itemProductTmp};
        const res = await FetchAPI.postDataAPI("/product/editProduct",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Cập nhật sản phẩm thành công !")
                setloadingBtn(false)
            }else{
                message.error("Có lỗi rồi !!")
                setloadingBtn(false)
            }
        }
    }
    const handleDeleteProduct = async()=>{
        setloadingTable(true);
        const data = {"id":itemProductTmp.id}
        const res = await FetchAPI.postDataAPI("/product/deleteProduct",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Xóa sản phẩm thành công");
                getFullProduct();
                setloadingTable(false);
                setshowModalDeleteProduct(false);
            }else{
                message.error("Có lỗi rồi !!");
                setloadingTable(false);
            }
        }
    }
    const onChangeImage = ({ fileList: newFileList }) => {
        if(newFileList.length===0){
            itemProductTmp.image="";
            formEdit.setFieldsValue({image:null})
        }else{
            if(newFileList[0].response){
                itemProductTmp.image="/Upload/ImageProduct/"+newFileList[0].response.msg.filename
                formEdit.setFieldsValue({image:"/Upload/ImageProduct/"+newFileList[0].response.msg.filename})
            }
        }
        setimageListUp(newFileList);
    };
    const columns  = [
        {
            title:"Mã sản phẩm",
            key:'id',
            render: record=><span>{record.id}</span>
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
                                setitemProductTmp(record);
                                formEdit.setFieldsValue(record);
                                setimageListUp([{url:record.image}])
                            }}
                        >
                            <EditOutlined />
                        </Button>
                        <Button 
                            type="primary" 
                            danger 
                            style={{ borderRadius:10,marginLeft:20 }} 
                            onClick={()=>{
                                setshowModalDeleteProduct(true);
                                setitemProductTmp(record)
                            }}
                        >
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
            width={overflowX ?"100%":520}
            getContainer={false}
            onClose={()=>setdrawerEdit(false)} 
            visible={drawerEdit}
        >
            {itemProductTmp !==undefined &&
            <Form 
                form={formEdit}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                onFinish={handleEditProduct}
            >
                <Form.Item
                    label="Tên sản phẩm"
                    name="name"
                    rules={[{ required: true, message: 'Tên sản phẩm không để trống!' }]}
                >
                    <Input 
                        placeholder="Tên sản phẩm"
                        value={itemProductTmp.name}
                        onChange= {(e)=>{itemProductTmp.name=e.target.value;console.log(itemProductTmp)}}
                    />
                </Form.Item>
                <Form.Item
                    label="Danh mục sản phẩm"
                    name="idCategory"
                    rules={[{ required: true, message: 'Danh mục sản phẩm không để trống!' }]}
                >
                    <Select
                        onChange= {(e)=>{
                            itemProductTmp.idCategory=e;
                            filterOption(e);
                        }
                        } 
                    >
                        {optionCategory}
                    </Select>
                </Form.Item>
                <Form.Item  
                    label="Loại sản phẩm"
                    name="nameProductType"
                    rules={[{ required: true, message: 'Loại sản phẩm không để trống!' }]}
                >
                    <Select
                        placeholder="Loại sản phẩm"
                        onChange= {(e)=>itemProductTmp.idProductType=e[1]} 
                    >
                        {optionProductType}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Giá sản phẩm"
                    name="price"
                    rules={[{ required: true, message: 'Giá sản phẩm không để trống!' }]}
                >
                    <InputNumber
                        placeholder="Giá sản phẩm"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                        value= {itemProductTmp.price}
                        onChange={(e)=>itemProductTmp.price=e}
                    />
                </Form.Item>
                <Form.Item
                    label="Giá khuyến mãi"
                    name="promotional"
                >
                    <InputNumber
                        placeholder="Giá khuyến mãi"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                        value={itemProductTmp.promotional}
                        onChange= {(e)=>itemProductTmp.promotional=e}
                    />
                </Form.Item>
                <Form.Item
                    label="Ảnh sản phẩm"
                    name="image"
                    rules={[{ required: true, message: 'Phải có ảnh gán cho sản phẩm!' }]}
                >
                    {/* <Image src={itemProductTmp.image} width={100} preview={false}/> */}
                    <ImgCrop 
                        rotate
                        grid
                        aspect={1.5/2.2}
                    >
                        <Upload
                            action="/uploads/uploadImageProduct"
                            listType="picture-card"
                            name="image"
                            fileList={imageListUp}
                            onChange={onChangeImage}
                        >
                            {imageListUp.length<1 &&
                                <div>
                                    <UploadOutlined />
                                    <span>   Tải ảnh lên</span> 
                                </div>
                            }                            
                        </Upload>  
                    </ImgCrop>
                </Form.Item>
                <Form.Item
                    label="Mô tả sản phẩm"
                    name="description"
                >
                    <CKEditor
                            editor={ ClassicEditor }
                            data={itemProductTmp.description===null?"":itemProductTmp.description}
                            config={{extraPlugins:[MyCustomUploadAdapterPlugin]}} //use this to upload image.
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                itemProductTmp.description = data
                            } }
                    />
                </Form.Item>
                <Form.Item style={{ paddingTop:20 }}  wrapperCol={{ span: 12, offset: 10 }}>
                    <Button type="primary" htmlType="submit" danger loading={loadingBtn}>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
            }
           
        </Drawer>
       
    )
    const ModalDeleteProduct = ()=>(
        <div>
        {showModalDeleteProduct &&
        <Modal
            title={`Xóa sản phẩm ${itemProductTmp.name}`}
            visible={showModalDeleteProduct}
            onCancel={()=>{setshowModalDeleteProduct(false)}}
            onOk={handleDeleteProduct}
            cancelText="Thoát"
            okText="Chắc chắn"
        >
            <p>Nếu bạn xóa sản phẩm. Tất cả thông tin về sản phẩm và kho hàng sẽ bị xóa đi.</p>
        </Modal>
        }
        </div>
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
                    loading={loadingTable}
                />
                 {DrawerEditProduct()}
                 {ModalDeleteProduct()}
            </div>

            :
            <Spinner spinning={!showContent}/>
        }
        </div>
    )
}