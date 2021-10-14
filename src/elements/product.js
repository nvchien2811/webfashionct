import React from 'react';
import { Image,Card  } from 'antd';
import {getPriceVND} from '../contain/getPriceVND';
import {Link} from 'react-router-dom';
const { Meta } = Card;
export default function product(props){
    const {image,name,price,id,promotional} = props.item;
    const path={
        pathname:`/product/id#${id}`
    }
    const hanldeShowPrice = ()=>{
        if(promotional===null){
            return(
                <span style={{ fontSize:16 }}>{getPriceVND(price)+" đ"}</span>
            )
        }else{
            return(
                <div style={{ display:'flex',flexDirection:'column' }}>
                    <span style={{ fontSize:16,textDecorationLine:'line-through' }}>{getPriceVND(price)+" đ"}</span>
                    <span style={{ fontSize:16,color:'red',fontWeight:'bold' }}>{getPriceVND(promotional)+" đ"}</span>
                </div>
            )
        }   
    }
    
    return(
            <Card
                className="itemProduct"
                hoverable
                cover={<Image alt="example" src={image} />}
            >
                <Link to={path}>
                    <Meta title={name} description={hanldeShowPrice()} />
                </Link>
            </Card>
       
    )
}