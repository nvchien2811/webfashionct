import * as FetchAPI from './fetchApi';

export const getCategoryById = async(data)=>{
    const res = await FetchAPI.postDataAPI("/product/getCategoryById",data);
    return res[0];
}

export const getPrductTypeById = async(data)=>{
    const res = await FetchAPI.postDataAPI("/product/getPrductTypeById",data);
    return res[0];
}