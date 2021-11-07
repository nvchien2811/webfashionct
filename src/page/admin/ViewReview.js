import React,{useEffect,useState,useRef} from 'react';
import {Table,Rate,Image} from 'antd';
import Spinner from '../../elements/spinner';
import * as FetchAPI from '../../util/fetchApi';
import {getColumnSearchProps} from '../../elements/SearchFilter';
import { useSelector } from 'react-redux';
export default function ViewReview(){
    const [showContent, setshowContent] = useState(false);
    const [dataFullReview, setdataFullReview] = useState({});
    const searchInput = useRef();
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);
    useEffect(()=>{
        getFullReview()
    },[])
    const getFullReview = async()=>{
        const res = await FetchAPI.getAPI("/review/getFullReview");
        console.log(res)
        setdataFullReview(res);
        setshowContent(true)
    }
    const columns  = [
        {
            title:"Tên sản phẩm",
            key:'Product',
            ...getColumnSearchProps('nameProduct',searchInput),
            render: record=>(
                <div style={{ display:'flex',alignItems:'center' }}>
                    <Image src={record.imageProduct} width={80} preview={false}/>
                    <span style={{ marginLeft:20 }}>{record.nameProduct}</span>
                </div>
            )
        },
        {
            title:"Email khách hàng",
            key:'emailUser',
            ...getColumnSearchProps('emailUser',searchInput)
        },
        {
            title:"Số sao",
            key:'reviewStar',
            render: record=>(
                <Rate 
                    value={record.reviewStar}
                    disabled
                />
            )
        },
        {
            title:"Đánh giá của khách hàng",
            key:'comment',
            render: record=><span>{record.comment}</span>
        }

    ]
    return(
        <div>
            {showContent ? 
            <div>
                <Table 
                    columns={columns}
                    dataSource={dataFullReview}
                    style={overflowX?{overflowX:'scroll'}:null} 
                />
            </div>
            :
            <Spinner spinning={!showContent}/>
            }
        </div>
    )
}