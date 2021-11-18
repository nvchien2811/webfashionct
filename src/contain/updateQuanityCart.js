import {updateQuanityProduct,updateCart} from '../redux/reducer/product.reducer';
import * as FetchAPI from '../util/fetchApi';
export const updateCartCurrent = async(dispatch)=>{
    const data = localStorage.getItem("cart")
    // localStorage.removeItem("cart");
    console.log(data)
    if(data===null||data===undefined){
        dispatch(updateQuanityProduct(0))
        dispatch(updateCart({}));
    }else{
        const obj = JSON.parse(data);
        dispatch(updateQuanityProduct(obj.length));
        const d = {"data":localStorage.getItem("cart")};
        const res = await FetchAPI.postDataAPI("/order/getProductByCart",d);
        let arrTmp = [];
        res.map((item,index)=>{
            arrTmp.push({key:index,...item})
        })
        dispatch(updateCart(arrTmp));
    }
}