import {createSlice} from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'product',
    initialState:{
        quanityCart:{}
    },
    reducers:{
        updateQuanityProduct: (state,action) =>{
            state.quanityCart = action.payload;
        }
    }
})

export const {updateQuanityProduct} = productSlice.actions;

export default productSlice.reducer;