import React ,{useEffect,useState,useLayoutEffect} from 'react';
import {InputNumber,Table,Image,message,Button} from 'antd';
import * as FetchAPI from '../../util/fetchApi';
import Spinner from '../../elements/spinner';
import {DeleteOutlined,PlusCircleOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
export default function Inventory(){
    const [dataInventory, setdataInventory] = useState();
    const [showContent, setshowContent] = useState(false);
    const [loadingTable, setloadingTable] = useState(false);
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
        setloadingTable(true);
        setshowContent(false);
        getFullInventory();
    },[])
    const getFullInventory = async()=>{
        const res = await FetchAPI.getAPI("/inventory/getFullInventory");
        if(res!==undefined){
            res.map(async(item,index)=>{
                const data = await FetchAPI.postDataAPI("/product/getProductDetails",{"id":item.idProduct})
                res[index].nameProduct = data[0].name;
                res[index].imageProduct = data[0].image;
                if(index===res.length-1){
                    res.sort(function(a,b){
                        return new Date(b.update_at) - new Date(a.update_at);
                    });
                    setdataInventory(res);
                    setshowContent(true);
                    setloadingTable(false);
                }
            })
        }
        setshowContent(true);
    }
    const updateQuanity = async(quanity,idProduct,size,name)=>{
        setloadingTable(true);
        const data = {"idProduct":idProduct,"quanity":quanity,"size":size};
        const res = await FetchAPI.postDataAPI("/inventory/updateQuanityInventory",data);
        if(res.msg){
            if(res.msg==="Success"){
                setTimeout(()=>{
                    message.success("Cập nhật sản phẩm "+name+" thành công !");
                    getFullInventory()
                },500)
            }else{
                setTimeout(()=>{
                    message.error("Có lỗi rồi !!");
                    setloadingTable(false);
                },500)
            }
        }
    }
    const columns  = [
        {
            title:"Sản phẩm",
            key:'product',
            render: record =>(
                <div style={{ display:'flex',alignItems:'center'}}>
                    <Image src={record.imageProduct} width={65} preview={false} /> 
                    <span style={{ fontWeight:'bold',marginLeft:20 }}>{record.nameProduct}</span>
                </div>
            )
        },
        {
            title:"Loại, kích cỡ",
            key:'option',
            render: record=><span>{record.size}</span>
        },
        {
            title:"Số lượng",
            key:'quanity',
            render: record=>(
                <InputNumber 
                    min={0} 
                    defaultValue={record.quanity}
                    onChange= {(value)=>updateQuanity(value,record.idProduct,record.size,record.nameProduct)}
                />)
        },
        {
            title:"Đã bán",
            key:'sold',
            render: record=><span style={{fontWeight:'bold',color:'gray'}}>{record.sold}</span>
        },
        {
            title:"Còn lại",
            key:'rest',
            render: record=><span>{record.quanity-record.sold}</span>
        },
        {
            title:"Cập nhật lần cuối",
            key:'lastUpdate',
            render: record=><span>{new Date(record.update_at).toString()}</span>
        },
        {
            title:"Tùy chỉnh",
            key:'option',
            render:record=><DeleteOutlined style={{marginLeft:15,fontSize:20,cursor:"pointer" }} />
        }
    ]
    return(
    <div>
        {showContent ?
        <div>
        <Button type="primary" style={{ marginBottom:20 }} danger >
            <Link to="/admin/addInventory" >
                Nhập kho <PlusCircleOutlined />
            </Link>    
        </Button>
        <Table 
            pagination={{ defaultPageSize: 5 }}
            columns={columns} 
            dataSource={dataInventory}
            style={overflowX?{overflowX:'scroll'}:null} 
            loading={loadingTable}
        />

        </div>
        
        :
        <Spinner spinning={!showContent}/>
        }
    </div>
    )
}