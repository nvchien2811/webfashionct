import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducer/user.reducer';
import productReducer from './reducer/product.reducer';
import layoutReducer from './reducer/layout.reducer';
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    userReducer,
    productReducer,
    layoutReducer
});
const store = configureStore({
    reducer:rootReducer
})
// store.dispatch(userReducer.updateUser({id:'12142'}));

export default store;
