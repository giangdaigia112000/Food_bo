import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../interface";
import {
    createUserService,
    deleteUserService,
    getAllUserService,
} from "../../service/api/userService";

import { notiError, notiSuccess } from "../../utils/notification";

export const getAllUser = createAsyncThunk("getAllUser", async () => {
    const resData = await getAllUserService();
    return resData;
});

export const createUser = createAsyncThunk(
    "createUser",
    async (data: any, thunkApi) => {
        const { name, email, role } = data;
        const resData = await createUserService({ name, email, role });
        thunkApi.dispatch(getAllUser());
        return resData;
    }
);

export const deleteUser = createAsyncThunk(
    "deleteUser",
    async (id: number, thunkApi) => {
        const resData = await deleteUserService(id);
        thunkApi.dispatch(getAllUser());
        return resData;
    }
);

export interface CateMovieState {
    listUser: User[];
    loading: boolean;
    loadingApi: boolean;
}

const initialState: CateMovieState = {
    listUser: [] as User[],
    loading: false,
    loadingApi: false,
};

export const SlideSlice = createSlice({
    name: "SlideSlice",
    initialState,
    reducers: {
        oke: (state, action: PayloadAction<boolean>) => {},
    },
    extraReducers: {
        [getAllUser.pending.toString()]: (state) => {
            state.loading = true;
        },
        [getAllUser.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
            state.listUser = action.payload;
        },
        [getAllUser.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
        },
        //////////////////////////////////////////////////////////////////
        [createUser.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [createUser.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Thêm bản ghi thành công!!!");
        },
        [createUser.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Thêm bản ghi lỗi.");
        },
        //////////////////////////////////////////////////////////////////
        [deleteUser.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [deleteUser.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Xóa bản ghi thành công.");
        },
        [deleteUser.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Xóa bản ghi lỗi.");
        },
        //////////////////////////////////////////////////////////////////
        // [updateSlide.pending.toString()]: (state) => {
        //     state.loadingApi = true;
        // },
        // [updateSlide.fulfilled.toString()]: (
        //     state,
        //     action: PayloadAction<any>
        // ) => {
        //     state.loadingApi = false;
        //     notiSuccess("Cập nhật bản ghi thành công.");
        // },
        // [updateSlide.rejected.toString()]: (
        //     state,
        //     action: PayloadAction<any>
        // ) => {
        //     state.loadingApi = false;
        //     notiError("Cập nhật bản ghi thất bại.");
        // },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { oke } = SlideSlice.actions;
export default SlideSlice.reducer;
