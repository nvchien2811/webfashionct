import * as FetchAPI from './fetchApi';
import {updateUser} from '../redux/reducer/user.reducer';

export const getUser = async(token,dispatch)=>{
    const data = {"token":token};
    const res = await FetchAPI.postDataAPI("/user/getUser",data);
    if(res.msg){
        if(res.msg.message ==="jwt expired"){
            localStorage.removeItem("token");
            return false;
        }
    }else{
        if(res[0].status===1){
            localStorage.removeItem("token");
            return "block";
        }else{
            dispatch(updateUser(res[0]));
            return true  
        }
       
    }
    
}