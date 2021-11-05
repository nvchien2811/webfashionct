import React from 'react';
import {Modal,List,Rate,Input,Button,message} from 'antd';

import * as FetchAPI from '../util/fetchApi';
export default function ModalReviewProduct (props) {
    // console.log(props.dataProduct)
    // console.log(props.user.id)
    const handleAddReview = async(data)=>{
        console.log(data)
        if(data.reviewStar===null){
            message.warning('Bạn hãy đánh giá số sao cho sản phẩm!')
        }else{
            message.success("Bấm thành công")
        }
       
    }
    const renderItem = (item)=>{
        return(
        <List.Item>
            <div style={{ width:'100%' }}>
                <span style={{ fontWeight:'bold' }}>{item.name_product}</span>
                <span style={{ marginLeft:10 }}>{`(${item.size})`}</span>
                <Rate 
                    defaultValue={item.reviewStar}
                    style={{marginLeft:20}}
                    onChange= {e=>item.reviewStar=e}
                />
                <Input.TextArea 
                    value={item.comment}
                    placeholder="Đánh giá của bạn về sản phẩm này"
                    onChange= {(e)=>item.comment=e.target.value}
                /> 
                <div style={{display:'flex', justifyContent:'center',paddingTop:20 }}>
                {item.reviewStar===null&&item.comment===null ?
                    <Button type="primary" danger onClick={()=>handleAddReview(item)}>
                        Đánh giá
                    </Button>
                :
                    <Button type="primary" danger onClick={()=>console.log(item)}>
                        Chỉnh sửa đánh giá
                    </Button>
                }
                </div>
            </div>

        </List.Item>
    )
    }
    return(
        <Modal
            title="Đánh giá sản phẩm"
            visible={props.visible}
            onCancel={props.onCancel}
            footer={false}
        >
          
            <List 
                itemLayout="horizontal"
                dataSource={props.dataProduct}
                renderItem= {renderItem}
            />
            
        </Modal>
    )
}   