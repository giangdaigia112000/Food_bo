import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import loginReducer from "./slice/loginSlice";
import slideReducer from "./slice/slideSlice";
import categoryReducer from "./slice/categorySlice";
import productReducer from "./slice/productSlice";
import blogReducer from "./slice/blogSlice";
import shopReducer from "./slice/shopSlice";
import userReducer from "./slice/userSlice";
import voucherReducer from "./slice/voucherSlice";
import orderReducer from "./slice/orderSlice";
import chartReducer from "./slice/chartSlice";

export function makeStore() {
    return configureStore({
        reducer: {
            login: loginReducer,
            user: userReducer,
            slide: slideReducer,
            category: categoryReducer,
            product: productReducer,
            blog: blogReducer,
            shop: shopReducer,
            voucher: voucherReducer,
            oder: orderReducer,
            chart: chartReducer,
        },
    });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
>;

export default store;
