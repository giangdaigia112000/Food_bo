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
            notiSuccess("Th??m b???n ghi th??nh c??ng!!!");
        },
        [createVoucher.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Th??m b???n ghi l???i.");
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
            notiSuccess("X??a b???n ghi th??nh c??ng.");
        },
        [deleteVoucher.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("X??a b???n ghi l???i.");
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
            notiSuccess("C???p nh???t b???n ghi th??nh c??ng.");
        },
        [updateVoucher.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("C???p nh???t b???n ghi th???t b???i.");
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { oke } = VoucherSlice.actions;
export default VoucherSlice.reducer;
