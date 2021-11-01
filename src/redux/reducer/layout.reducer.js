import {createSlice} from '@reduxjs/toolkit';

const layoutSlice = createSlice({
    name: 'product',
    initialState:{
        overflowX:false
    },
    reducers:{
        updateOverflowX: (state,action) =>{
            state.overflowX = action.payload;
        },
    }
})

export const {updateOverflowX} = layoutSlice.actions;

export default layoutSlice.reducer;