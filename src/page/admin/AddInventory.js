import React,{useEffect,useState} from 'react';
import {Form,Input,Select,Image,InputNumber,Button,PageHeader,message} from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import { useHistory } from 'react-router-dom';
const { Option } = Select;
export default function AddInventory(){
    const [formAdd] = Form.useForm();
    const [dataProduct, setdataProduct] = useState();
    const [productToAdd, setproductToAdd] = useState();
    const [option, setoption] = useState();
    const [quanity, setquanity] = useState(1);
    const history = useHistory();

    useEffect(()=>{ 
        getFullProduct()
    },[])
    const getFullProduct = async()=>{
        let product = [];
        const res = await FetchAPI.getAPI("/product/getFullProduct");
        res.map((item,index)=>{
            product.push(
                <Option value={[item.name,item.id]}>
                    {item.name}
                    <div style={{ display:'flex',justifyContent:'flex-end',marginTop:-20,paddingRight:20 }}>
                        <Image src={item.image} width={40} preview={false}/>
                    </div>
                </Option>
            )
            if(index===res.length-1){
                setdataProduct(product)
            }
        })
    }
    const handleChangeProduct = (value)=>{
        setproductToAdd(value)
    }
    const handleQuanity = (value) =>{
        if(value==null){
            formAdd.setFieldsValue({quanity:1});
            setquanity(1)
        }
        setquanity(value)
    }
    const handleAddInventory = async()=>{
        const data = {"idProduct":productToAdd[1],"quanity":quanity,"option":option};
        const res = await FetchAPI.postDataAPI("/inventory/addInventory",data);
        if(res.msg){
            if(res.msg==="The product exist"){
                message.warning("Sản phẩm này đã nằm trong kho hàng, hãy kiểm tra lại !")
                formAdd.setFieldsValue({quanity:1,product:null,option:null})
            }
            if(res.msg==="Success"){
                message.success("Nhập kho thành công, quay lại kho để xem !");
                formAdd.setFieldsValue({quanity:1,product:null,option:null})
            }
        }
    }
    return(
        <div> 
        <PageHeader
            className="site-page-header"
            onBack={() => history.goBack()}
            title="Nhập kho"
        />
    
        <Form 
            form={formAdd}  
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 19 }}
            style={{paddingTop:20}}
            onFinish={handleAddInventory}
            initialValues={{quanity:1}}
        >
            <Form.Item
                label={<span style={{ fontWeight:'bold',fontSize:16 }}>Sản phẩm</span>}
                name="product"
                style={{ width:'80%'}}
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng chọn sản phẩm !' },
                ]}
            >
            <Select
                // mode="multiple"
                size="large"
                showSearch
                allowClear
                style={{ width: '100%'}}
                placeholder="Chọn sản phẩm"
                onChange={handleChangeProduct}
                >
                {dataProduct}
            </Select>
            </Form.Item>
            <Form.Item
                label="Tùy chọn"
                name="option"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui lòng nhập loại, kích thước, màu sắc !' },
                ]}
                style={{width:'80%'}}
            >
                <Input
                    placeholder="Nhập loại, kích thước, màu sắc !"
                    value={option}
                    defaultValue={option}
                    onChange= {(e)=>setoption(e.target.value)}
                    maxLength={24}
                    style={{height:40}}
                />
            </Form.Item>
            <Form.Item
                label="Số lượng"
                name="quanity"
                rules={[
                    { required: true, message: 'Vui lòng chọn số lượng !' },
                ]}
                style={{width:'80%'}}
            >
                <InputNumber 
                    min={1}  
                    onChange = {handleQuanity} 
                />
            </Form.Item>
            <Form.Item  style={{ padding:"10px 0px",justifyContent:'center' }} >
                <Button htmlType="submit" type="primary" danger style={{ width:100,height:45,borderRadius:8 }}>
                   Nhập kho
                </Button>
            </Form.Item>
        </Form>
        </div>
    )
}