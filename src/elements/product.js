import React from 'react';
import { Image,Card  } from 'antd';
import {getPriceVND} from '../contain/getPriceVND';
const { Meta } = Card;
export default function product(props){
    const {image,name,price} = props.item;
    return(
        <Card
            className="itemProduct"
            hoverable
            cover={<Image alt="example" src={image} />}
        >
            <Meta title={name} description={getPriceVND(price)+ " đ"} />
        </Card>
    )
}