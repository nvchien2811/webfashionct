import {createSlice} from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'product',
    initialState:{
        cart:{},
        quanityCart:{}
    },
    reducers:{
        updateQuanityProduct: (state,action) =>{
            state.quanityCart = action.payload;
        },
        updateCart :(state,action) =>{
            state.cart = action.payload;
        }
    }
})

export const {updateQuanityProduct,updateCart} = productSlice.actions;

export default productSlice.reducer;