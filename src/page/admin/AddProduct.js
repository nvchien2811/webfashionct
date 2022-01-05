import React,{useState,useEffect} from 'react';
import {Form,Input,Select,InputNumber,Upload,Button,PageHeader,message } from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import ImgCrop from 'antd-img-crop';
import {UploadOutlined} from '@ant-design/icons'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyCustomUploadAdapterPlugin from '../../contain/uploadImageDescriprption';
import { useHistory } from 'react-router-dom';
const {Option} = Select;
export default function AddProduct(){
    const [name, setname] = useState();
    const [idcategory, setidcategory] = useState();
    const [idproduct_type, setidproduct_type] = useState();
    const [price, setprice] = useState();
    const [promotional, setpromotional] = useState();
    const [image, setimage] = useState([]);
    const [imageDecription, setimageDecription] = useState([]);
    const [description, setdescription] = useState(null);
    const [optionFullProductType, setoptionFullProductType] = useState();
    const [optionProductType, setoptionProductType] = useState();
    const [optionCategory, setoptionCategory] = useState();
    const [loadingBtn, setloadingBtn] = useState(false);
    const [formadd] = Form.useForm();
    const history = useHistory();
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
    const handleAddProdcuct = async()=>{
        setloadingBtn(true);
        let imageUrl = null;
        let url1 = null;
        let url2 = null;
        let url3 = null;
        let url4 = null;
        if(image.length!==0){
            imageUrl = "/Upload/ImageProduct/"+image[0].response.msg.filename;
        }
        if(imageDecription.length!==0){
            url1="/Upload/ImageProduct/"+imageDecription[0].response.msg.filename
            if(imageDecription.length>=2){
                url2="/Upload/ImageProduct/"+imageDecription[1].response.msg.filename
            }
            if(imageDecription.length>=3){
                url3="/Upload/ImageProduct/"+imageDecription[2].response.msg.filename
            }
            if(imageDecription===4){
                url4="/Upload/ImageProduct/"+imageDecription[3].response.msg.filename
            }
        }
        const data = {
            "name":name,
            "price":price,
            "promotional":promotional,
            "image":imageUrl,
            "idCategory":idcategory,
            "idProductType":idproduct_type[1],
            "imageDecription1":url1,
            "imageDecription2":url2,
            "imageDecription3":url3,
            "imageDecription4":url4,
            "description":description
        }
        console.log(data)
        const res = await FetchAPI.postDataAPI("/product/addProduct",data);
        if(res.msg){
            if(res.msg==="Success"){
                message.success("Thêm sản phẩm thành công");
                formadd.setFieldsValue(null);
                history.replace('/admin/notify_add_product')
                setloadingBtn(false);
            }else{
                message.error("Có lỗi rồi !!");
                setloadingBtn(false);
            }
        }
    }
    const onPreviewImage = async file => {
        let src = file.url;
        if (!src) {
          src = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
      };
    const onChangeImage = ({ fileList: newFileList }) => {
        setimage(newFileList);
        formadd.setFieldsValue({image:newFileList})
    };
    const onChangeImageDecription = ({ fileList: newFileList }) => {
        setimageDecription(newFileList);
    };
    const filterOption = (value,init)=>{
        let arrTmp = optionFullProductType;
        arrTmp = arrTmp.filter(e=>e.props.value[2]===value);
        setoptionProductType(arrTmp)
        if(!init){
            formadd.setFieldsValue({nameProductType:null})
        }  
    }
  
    return(
        <div style={{ overflow:"hidden" }}>
            <PageHeader
                title="Thêm sản phẩm Fashion CT" 
                className="site-page-header"
            />
            <Form 
                form={formadd}
                labelCol={{ xl:4,md:6,sm:8}}
                wrapperCol={{ xl:17,md:15,sm:13 }}
                onFinish={handleAddProdcuct}
            >
                <Form.Item
                    label="Tên sản phẩm"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm'}]}
                >
                    <Input 
                        placeholder="Nhập tên sản phẩm"
                        value={name}
                        onChange= {e=>setname(e.target.value)}
                    />
                </Form.Item>
                <Form.Item
                    label="Danh mục sản phẩm"
                    name="category"
                    rules={[{required:true, message:'Vui lòng chọn danh mục sản phẩm'}]}
                >
                    <Select
                        placeholder="Danh mục sản phẩm"
                        value={idcategory}
                        onChange={e=>{
                            setidcategory(e);
                            filterOption(e);
                        }}
                    >
                        {optionCategory}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Loại sản phẩm"
                    name="productType"
                    rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm'}]}
                >
                    <Select
                        value={idproduct_type}
                        placeholder="Loại sản phẩm"
                        onChange= {e=>setidproduct_type(e)}
                    >
                        {optionProductType}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Giá sản phẩm"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm'}]}
                >
                    <InputNumber 
                        placeholder="Giá sản phẩm"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        min={0}
                        style={{ width:200 }}
                        value={price}
                        onChange= {e=>setprice(e)}
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
                        style={{ width:200 }}
                        value={promotional}
                        onChange= {e=>setpromotional(e)}
                    />
                </Form.Item>
                <Form.Item
                    label="Ảnh sản phẩm"
                    name="image"
                    valuePropName="fileList"
                    rules={[{ required: true, message: 'Vui lòng chọn ảnh sản phẩm'}]}
                >
                <ImgCrop 
                    rotate
                    grid
                    aspect={1.5/2.2}
                >
                    <Upload
                        action="/uploads/uploadImageProduct"
                        listType="picture-card"
                        name="image"
                        fileList={image}
                        onChange={onChangeImage}
                        onPreview={onPreviewImage}
                    >
                        {image.length===0 && 
                        <div>
                            <UploadOutlined />
                            <span>   Tải ảnh lên</span> 
                        </div>
                        }
                    </Upload>  
                </ImgCrop>
                </Form.Item>
                <Form.Item
                    label="Ảnh mô tả chi tiết"
                    name="imageDecription"
                >
                <ImgCrop 
                    rotate
                    aspect={1.5/2.2}
                    grid
                >
                    <Upload
                        action="/uploads/uploadImageProduct"
                        listType="picture-card"
                        name="image"
                        fileList={imageDecription}
                        onChange={onChangeImageDecription}
                        onPreview={onPreviewImage}
                    >
                        {imageDecription.length<4 && 
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
                    name="decription"
                >
                     <CKEditor
                            editor={ ClassicEditor }
                            data={description}
                        
                            config={{extraPlugins:[MyCustomUploadAdapterPlugin]}} //use this to upload image.

                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                setdescription(data);
                            } }
                    />
                </Form.Item>
                <Form.Item style={{ paddingTop:20 }} wrapperCol={{ span: 12, offset: 12 }}>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        style={{ height:50,borderRadius:10 }} 
                        danger 
                        loading={loadingBtn}
                    >
                        Thêm sản phẩm
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}