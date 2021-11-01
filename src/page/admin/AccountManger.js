import React ,{useEffect,useState} from 'react';
import * as FetchAPI from '../../util/fetchApi';
export default function AccountManger(){

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