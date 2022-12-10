import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, Voucher } from "../../interface";
import {
    getAllOrderService,
    updateOrderService,
} from "../../service/api/orderService";

import { notiError, notiSuccess } from "../../utils/notification";

export const getAllOrder = createAsyncThunk("getAllOrder", async () => {
    const resData = await getAllOrderService();
    return resData;
});

export const updateOrder = createAsyncThunk(
    "updateOrder",
    async (data: any, thunkApi) => {
        const { id, status } = data;
        const resData = await updateOrderService(id, {
            status,
        });
        thunkApi.dispatch(getAllOrder());
        return resData;
    }
);

export interface VoucherState {
    listOrder: Order[];
    loading: boolean;
    loadingUpdateOrder: boolean;
}

const initialState: VoucherState = {
    listOrder: [] as Order[],
    loading: false,
    loadingUpdateOrder: false,
};

export const OrderSlice = createSlice({
    name: "OrderSlice",
    initialState,
    reducers: {
        oke: (state, action: PayloadAction<boolean>) => {},
    },
    extraReducers: {
        [getAllOrder.pending.toString()]: (state) => {
            state.loading = true;
        },
        [getAllOrder.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
            state.listOrder = action.payload;
        },
        [getAllOrder.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
        },
        //////////////////////////////////////////////////////////////////

        [updateOrder.pending.toString()]: (state) => {
            state.loadingUpdateOrder = true;
        },
        [updateOrder.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingUpdateOrder = false;
            notiSuccess("Cập nhật trạng thái thành công.");
        },
        [updateOrder.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingUpdateOrder = false;
            notiError("Cập nhật trạng thái thất bại.");
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { oke } = OrderSlice.actions;
export default OrderSlice.reducer;
