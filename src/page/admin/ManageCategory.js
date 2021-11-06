import React,{useEffect,useState} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import {Table,Button,Form,Input,Select,Modal,message,Drawer,Upload} from 'antd';
import {PlusCircleOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import Spinner from '../../elements/spinner';
import {useSelector} from 'react-redux';
import {UploadOutlined} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
const {Option} = Select;
export default function ManageCategory(){
    const [dataFullCategory, setdataFullCategory] = useState();
    const [showContent, setshowContent] = useState(false);
    const [dataFullProduct, setdataFullProduct] = useState();
    const [showModalAdd, setshowModalAdd] = useState(false);
    const [drawerEdit, setdrawerEdit] = useState(false);
    const [dataAdd, setdataAdd] = useState({});
    const [itemTmp, setitemTmp] = useState({});
    const [loadingBtn, setloadingBtn] = useState();
    const [formAdd] = Form.useForm();
    const [formEdit] = Form.useForm();
    const [logoCategory, setlogoCategory] = useState([]);
    const [logoTmp, setlogoTmp] = useState([]);
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);

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
    const handleAddCategory = async()=>{
        setloadingBtn(true);
        const data = {"data":dataAdd,"logo":"/Upload/ImageDescription/"+logoCategory[0].response.msg.filename};
        const res = await FetchAPI.postDataAPI("/product/addCategory",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Thêm mới thành công");
                getCategory();
                setdataAdd({});
                formAdd.setFieldsValue({name:"",status:null})
                setloadingBtn(false)
                setshowModalAdd(false)

            }else{
                message.error("Có lỗi rồi !!")
                setloadingBtn(false)
            }
        }
    }
    const handleEditCategory = async()=>{
        setloadingBtn(true);
        const data = {"data":itemTmp,"logo":"/Upload/ImageDescription/"+logoTmp[0].response.msg.filename};
        const res = await FetchAPI.postDataAPI("/product/editCategory",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Cập nhật thành công");
                getCategory();
                setitemTmp({})
                formEdit.setFieldsValue({name:"",status:null})
                setloadingBtn(false)
            }else{
                message.error("Có lỗi rồi !!")
            }
        }
    }
    const onChangeImage = ({ fileList: newFileList }) => {
        setlogoCategory(newFileList);
        formAdd.setFieldsValue({logo:newFileList})
    };
    const onChangeLogoEdit = ({ fileList: newFileList }) => {
        setlogoTmp(newFileList);
        formEdit.setFieldsValue({logo:newFileList})
    };
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
                                if(record.logo!==null){
                                    setlogoTmp([{url:record.logo}]);
                                }else{
                                    setlogoTmp([])
                                }
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
            title="Chỉnh danh mục sản phẩm"
            visible={drawerEdit}
            width={overflowX ?"100%":520}
            onClose={()=>setdrawerEdit(false)}
        >
            <Form
              form={formEdit}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
              onFinish={handleEditCategory}
            >
                <Form.Item
                    label="Tên danh mục sản phẩm"
                    name="name"
                >
                    <Input
                        placeholder="Nhập tên danh mục sản phẩm"
                        value={itemTmp.name}
                        onChange= {(e)=>itemTmp.name=e.target.value}
                    /> 
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
                <Form.Item
                    label="Logo"
                    name="logo"
                    rules={[{ required: true, message: 'Vui lòng chọn logo'}]}
                >
                     <ImgCrop 
                        rotate
                        grid
                        aspect={1.5/2.2}
                    >
                        <Upload
                            action="/uploads/uploadImageProductDescription"
                            listType="picture-card"
                            name="image"
                            fileList={logoTmp}
                            onChange={onChangeLogoEdit}
                        >
                            {logoTmp.length<1 &&
                                <div>
                                    <UploadOutlined />
                                    <span>   Tải ảnh lên</span> 
                                </div>
                            }                            
                        </Upload>  
                    </ImgCrop>
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
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 12 }}
                onFinish={handleAddCategory}
            >
                <Form.Item
                    label="Tên danh mục sản phẩm"
                    name="name"
                    rules={[{ required: true, message: 'Nhập tên danh mục sản phẩm'}]}
                >
                    <Input
                        placeholder="Nhập tên danh mục sản phẩm"
                        value={dataAdd.name}
                        onChange= {(e)=>setdataAdd({...dataAdd,name:e.target.value})}
                    /> 
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
                <Form.Item
                    label="Logo"
                    name="logo"
                    rules={[{ required: true, message: 'Bạn phải chọn logo cho danh mục sản phẩm'}]}
                >
                <ImgCrop 
                    rotate
                    grid
                    aspect={1.5/2.2}
                >
                    <Upload
                        action="/uploads/uploadImageProductDescription"
                        listType="picture-card"
                        name="image"
                        fileList={logoCategory}
                        onChange={onChangeImage}
                    >
                        {logoCategory.length===0 && 
                        <div>
                            <UploadOutlined />
                            <span>   Tải ảnh lên</span> 
                        </div>
                        }
                    </Upload>  
                </ImgCrop>
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
                <Table 
                    columns={columns}
                    dataSource={dataFullCategory}
                    style={overflowX?{overflowX:'scroll'}:null} 
                />
                {ModalAddNew()}
                {DrawerEdit()}
            </div>            
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}