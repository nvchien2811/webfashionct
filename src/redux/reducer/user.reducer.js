import {createSlice} from '@reduxjs/toolkit';
const userSlice = createSlice({
    name: 'user',
    initialState:{
        currentUser:{}
    },
    reducers:{
        updateUser: (state,action) =>{
            state.currentUser = action.payload;
        }
    }
})
export const {updateUser} = userSlice.actions;

export default userSlice.reducer;