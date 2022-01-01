import React from 'react';
import { Image,Card,Badge  } from 'antd';
import {getPriceVND} from '../contain/getPriceVND';
import {Link} from 'react-router-dom';
import PreviewImmage from './PreviewImmage';
const { Meta } = Card;
export default function product(props){
    const {image,name,price,id,promotional} = props.item;
    const s = Math.round((price - promotional)/price*100);
    const path={
        pathname:`/product/${id}`
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
    const title2 = (
        <Link className="title-card-product" to={path}>{name}</Link>
    )
    return(
            <Card
                className="itemProduct"
                hoverable
                style={props.width!==undefined?{width:props.width}:{width:270,borderRadius:20}}
                cover={
                <div>
                    {s === 100 ? 
                    <div style={{ overflow:"hidden" }}>
                        <Image alt="example" src={image} preview={{mask:(<PreviewImmage/>)}}/>
                    </div>
                    :
                    <Badge.Ribbon text={s+"%"} color="red">
                        <div style={{ overflow:"hidden" }}>
                            <Image style={{ overflow:"hidden" }} alt="example" src={image} preview={{mask:(<PreviewImmage/>)}}/>
                        </div>
                    </Badge.Ribbon>
                    }
                </div>
               
            
                }
            >
                <Meta title={title2} description={hanldeShowPrice()} />
            </Card>
       
    )
}