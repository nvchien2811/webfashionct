import React ,{useEffect,useState} from 'react';
import * as FetchAPI from '../../util/fetchApi';
import { useSelector } from 'react-redux';
export default function AccountManger(){
    const overflowX = useSelector(state=>state.layoutReducer.overflowX);
    
    useEffect(async()=>{
        const res = await FetchAPI.getAPI("/user/getFullUser");
        console.log(res)
    },[])
    return(
    <div>
        Đây là trang chủ quản lý tài khoản
    </div>
    )
}