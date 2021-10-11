import React from 'react';
import { Image,Card  } from 'antd';
import {getPriceVND} from '../contain/getPriceVND';
import {Link} from 'react-router-dom';
const { Meta } = Card;
export default function product(props){
    const {image,name,price,id} = props.item;
    const path={
        pathname:`/product/id=${id}`
    }
    return(
            <Card
                className="itemProduct"
                hoverable
                cover={<Image alt="example" src={image} />}
            >
                <Link to={path}>
                    <Meta title={name} description={getPriceVND(price)+ " đ"} />
                </Link>
            </Card>
       
    )
}