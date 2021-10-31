import React,{useState,useEffect} from 'react';
import {Form,Input,Select,InputNumber,Upload,Button } from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import ImgCrop from 'antd-img-crop';
const {Option} = Select;
export default function AddProduct(){
    const [name, setname] = useState();
    const [idcategory, setidcategory] = useState();
    const [idproduct_type, setidproduct_type] = useState();
    const [price, setprice] = useState();
    const [promotional, setpromotional] = useState();
    const [image, setimage] = useState([]);
    const [imageDecription, setimageDecription] = useState([]);
    const [optionFullProductType, setoptionFullProductType] = useState();
    const [optionProductType, setoptionProductType] = useState();
    const [optionCategory, setoptionCategory] = useState();
    const [formadd] = Form.useForm();

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
        console.log(image[0].response.msg.filename)
        console.log(imageDecription[0].response.msg.filename)
        console.log(imageDecription[1].response.msg.filename)
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
    const getFile = (e) => {
        console.log('Upload event:', e);
 
        if (Array.isArray(e)) {
          return e;
        }
       return e && e.fileList;
    };
      
    return(
        <div>
            <Form 
                form={formadd}
                labelCol={{ span:4}}
                wrapperCol={{ span:15 }}
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
                    getValueFromEvent={getFile}
                    // rules={[{ required: true, message: 'Vui lòng chọn ảnh sản phẩm'}]}
                >
                <ImgCrop rotate>
                    <Upload
                        action="/uploads/uploadImageProduct"
                        listType="picture-card"
                        name="image"
                        fileList={image}
                        onChange={onChangeImage}
                        onPreview={onPreviewImage}
                    >
                        {image.length===0 && '+ Tải ảnh lên'}
                    </Upload>  
                    </ImgCrop>
                </Form.Item>
                <Form.Item
                    label="Ảnh mô tả chi tiết"
                    name="imageDecription"
                >
                <ImgCrop rotate>
                    <Upload
                        action="/uploads/uploadImageProduct"
                        listType="picture-card"
                        name="image"
                        fileList={imageDecription}
                        onChange={onChangeImageDecription}
                        onPreview={onPreviewImage}
                    >
                        {imageDecription.length<4 && '+ Tải ảnh lên'}
                    </Upload>  
                    </ImgCrop>
                </Form.Item>
                <Form.Item style={{ paddingTop:20 }}>
                    <Button type="primary" htmlType="submit" danger >
                        Thêm
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}