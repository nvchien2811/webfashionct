import * as FetchAPI from './fetchApi';

export const getNameCategory = async(data)=>{
    const res = await FetchAPI.postDataAPI("/product/getCategoryById",data);
    const name = res[0].name;
    console.log(name)
    return name;
}

export const getNameProductType = async(data)=>{
    const res = await FetchAPI.postDataAPI("/product/getPrductTypeById",data);
    const name = res[0].name;
    return name;
}