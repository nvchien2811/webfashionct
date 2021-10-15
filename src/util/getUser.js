import * as FetchAPI from './fetchApi';
import {updateUser} from '../redux/reducer/user.reducer';

export const getUser = async(token,dispatch)=>{
    const data = {"token":token};
    const res = await FetchAPI.postDataAPI("/user/getUser",data);
    
    dispatch(updateUser(res[0]));
}