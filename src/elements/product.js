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
        <Link to={path}>
            <Card
                className="itemProduct"
                hoverable
                cover={<Image alt="example" src={image} />}
                as={Link}
                to={"/product"}
            >
                <Meta title={name} description={getPriceVND(price)+ " đ"} />
            </Card>
        </Link>
    )
}