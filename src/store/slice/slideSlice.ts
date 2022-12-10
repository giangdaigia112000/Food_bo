import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Slider } from "../../interface";
import {
    createSlideService,
    deleteSlideService,
    getAllSlideService,
    updateSlideService,
} from "../../service/api/slideService";

import { notiError, notiSuccess } from "../../utils/notification";

export const getAllSlide = createAsyncThunk("getAllSlide", async () => {
    const resData = await getAllSlideService();
    return resData;
});

export const createSlide = createAsyncThunk(
    "createSlide",
    async (data: any, thunkApi) => {
        const { name, imageFile } = data;
        const bodyData = new FormData();
        bodyData.append("name", name);
        bodyData.append("image", imageFile);
        const resData = await createSlideService(bodyData);
        thunkApi.dispatch(getAllSlide());
        return resData;
    }
);

export const updateSlide = createAsyncThunk(
    "updateSlide",
    async (data: any, thunkApi) => {
        const { id, name, imageFile } = data;
        const bodyData = new FormData();
        bodyData.append("name", name);
        bodyData.append("_method", "put");
        if (imageFile) bodyData.append("image", imageFile);
        const resData = await updateSlideService(id, bodyData);
        thunkApi.dispatch(getAllSlide());
        return resData;
    }
);

export const deleteSlide = createAsyncThunk(
    "deleteSlide",
    async (id: number, thunkApi) => {
        const resData = await deleteSlideService(id);
        thunkApi.dispatch(getAllSlide());
        return resData;
    }
);

export interface CateMovieState {
    listSlide: Slider[];
    loading: boolean;
    loadingApi: boolean;
}

const initialState: CateMovieState = {
    listSlide: [] as Slider[],
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
        [getAllSlide.pending.toString()]: (state) => {
            state.loading = true;
        },
        [getAllSlide.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
            state.listSlide = action.payload;
        },
        [getAllSlide.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
        },
        //////////////////////////////////////////////////////////////////
        [createSlide.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [createSlide.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Thêm bản ghi thành công!!!");
        },
        [createSlide.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Thêm bản ghi lỗi.");
        },
        //////////////////////////////////////////////////////////////////
        [deleteSlide.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [deleteSlide.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Xóa bản ghi thành công.");
        },
        [deleteSlide.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Xóa bản ghi lỗi.");
        },
        //////////////////////////////////////////////////////////////////
        [updateSlide.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [updateSlide.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Cập nhật bản ghi thành công.");
        },
        [updateSlide.rejected.toString()]: (
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
export const { oke } = SlideSlice.actions;
export default SlideSlice.reducer;
