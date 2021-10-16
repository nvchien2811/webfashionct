import React,{useEffect} from 'react';

export default function Admin(){
    useEffect(()=>{
        document.getElementsByClassName("header-nav")[0].style.display = 'none';
        document.getElementsByClassName("footer")[0].style.display = 'none';
    },[])
    return(
        <div>
            Đây là page admin
        </div>
    )
}