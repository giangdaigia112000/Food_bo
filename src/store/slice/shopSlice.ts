import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shop } from "../../interface";
import {
    createShopService,
    deleteShopService,
    getAllShopService,
    updateShopService,
} from "../../service/api/shopService";

import { notiError, notiSuccess } from "../../utils/notification";

export const getAllShop = createAsyncThunk("getAllShop", async () => {
    const resData = await getAllShopService();
    return resData;
});

export const createShop = createAsyncThunk(
    "createShop",
    async (data: any, thunkApi) => {
        const { address } = data;
        const resData = await createShopService({ address });
        thunkApi.dispatch(getAllShop());
        return resData;
    }
);

export const updateShop = createAsyncThunk(
    "updateShop",
    async (data: any, thunkApi) => {
        const { id, address } = data;
        const resData = await updateShopService(id, {
            address,
            _method: "put",
        });
        thunkApi.dispatch(getAllShop());
        return resData;
    }
);

export const deleteShop = createAsyncThunk(
    "deleteShop",
    async (id: number, thunkApi) => {
        const resData = await deleteShopService(id);
        thunkApi.dispatch(getAllShop());
        return resData;
    }
);

export interface ShopState {
    listShop: Shop[];
    loading: boolean;
    loadingApi: boolean;
}

const initialState: ShopState = {
    listShop: [] as Shop[],
    loading: false,
    loadingApi: false,
};

export const ShopSlice = createSlice({
    name: "ShopSlice",
    initialState,
    reducers: {
        oke: (state, action: PayloadAction<boolean>) => {},
    },
    extraReducers: {
        [getAllShop.pending.toString()]: (state) => {
            state.loading = true;
        },
        [getAllShop.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
            state.listShop = action.payload;
        },
        [getAllShop.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
        },
        //////////////////////////////////////////////////////////////////
        [createShop.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [createShop.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Th??m b???n ghi th??nh c??ng!!!");
        },
        [createShop.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Th??m b???n ghi l???i.");
        },
        //////////////////////////////////////////////////////////////////
        [deleteShop.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [deleteShop.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("X??a b???n ghi th??nh c??ng.");
        },
        [deleteShop.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("X??a b???n ghi l???i.");
        },
        //////////////////////////////////////////////////////////////////
        [updateShop.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [updateShop.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("C???p nh???t b???n ghi th??nh c??ng.");
        },
        [updateShop.rejected.toString()]: (
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
export const { oke } = ShopSlice.actions;
export default ShopSlice.reducer;
