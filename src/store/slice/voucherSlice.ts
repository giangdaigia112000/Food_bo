import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Voucher } from "../../interface";
import {
    createVoucherService,
    deleteVoucherService,
    getAllVoucherService,
    updateVoucherService,
} from "../../service/api/voucherService";

import { notiError, notiSuccess } from "../../utils/notification";

export const getAllVoucher = createAsyncThunk("getAllVoucher", async () => {
    const resData = await getAllVoucherService();
    return resData;
});

export const createVoucher = createAsyncThunk(
    "createVoucher",
    async (data: any, thunkApi) => {
        const { code, discount, type, start, end } = data;
        const resData = await createVoucherService({
            code,
            discount,
            type,
            start,
            end,
        });
        thunkApi.dispatch(getAllVoucher());
        return resData;
    }
);

export const updateVoucher = createAsyncThunk(
    "updateVoucher",
    async (data: any, thunkApi) => {
        const { id, code, discount, type, start, end } = data;
        const resData = await updateVoucherService(id, {
            code,
            discount,
            type,
            start,
            end,
        });
        thunkApi.dispatch(getAllVoucher());
        return resData;
    }
);

export const deleteVoucher = createAsyncThunk(
    "deleteVoucher",
    async (id: number, thunkApi) => {
        const resData = await deleteVoucherService(id);
        thunkApi.dispatch(getAllVoucher());
        return resData;
    }
);

export interface VoucherState {
    listVoucher: Voucher[];
    loading: boolean;
    loadingApi: boolean;
}

const initialState: VoucherState = {
    listVoucher: [] as Voucher[],
    loading: false,
    loadingApi: false,
};

export const VoucherSlice = createSlice({
    name: "VoucherSlice",
    initialState,
    reducers: {
        oke: (state, action: PayloadAction<boolean>) => {},
    },
    extraReducers: {
        [getAllVoucher.pending.toString()]: (state) => {
            state.loading = true;
        },
        [getAllVoucher.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
            state.listVoucher = action.payload;
        },
        [getAllVoucher.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
        },
        //////////////////////////////////////////////////////////////////
        [createVoucher.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [createVoucher.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Thêm bản ghi thành công!!!");
        },
        [createVoucher.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Thêm bản ghi lỗi.");
        },
        //////////////////////////////////////////////////////////////////
        [deleteVoucher.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [deleteVoucher.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Xóa bản ghi thành công.");
        },
        [deleteVoucher.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Xóa bản ghi lỗi.");
        },
        //////////////////////////////////////////////////////////////////
        [updateVoucher.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [updateVoucher.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Cập nhật bản ghi thành công.");
        },
        [updateVoucher.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Cập nhật bản ghi thất bại.");
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { oke } = VoucherSlice.actions;
export default VoucherSlice.reducer;
