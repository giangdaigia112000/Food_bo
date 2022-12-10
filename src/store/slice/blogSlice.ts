import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Blog } from "../../interface";
import {
    createBlogService,
    deleteBlogService,
    getAllBlogService,
    updateBlogService,
} from "../../service/api/blogService";

import { notiError, notiSuccess } from "../../utils/notification";

export const getAllBlog = createAsyncThunk("getAllBlog", async () => {
    const resData = await getAllBlogService();
    return resData;
});

export const createBlog = createAsyncThunk(
    "createBlog",
    async (data: any, thunkApi) => {
        const { title, imageFile, desc, type, content } = data;
        const bodyData = new FormData();
        bodyData.append("title", title);
        bodyData.append("desc", desc);
        bodyData.append("type", type);
        bodyData.append("content", content);
        bodyData.append("thumb", imageFile);
        const resData = await createBlogService(bodyData);
        thunkApi.dispatch(getAllBlog());
        return resData;
    }
);

export const updateBlog = createAsyncThunk(
    "updateBlog",
    async (data: any, thunkApi) => {
        const { id, title, imageFile, desc, type, content } = data;
        const bodyData = new FormData();
        bodyData.append("title", title);
        bodyData.append("desc", desc);
        bodyData.append("type", type);
        bodyData.append("content", content);
        bodyData.append("_method", "put");
        if (imageFile) bodyData.append("thumb", imageFile);
        const resData = await updateBlogService(id, bodyData);
        thunkApi.dispatch(getAllBlog());
        return resData;
    }
);

export const deleteBlog = createAsyncThunk(
    "deleteBlog",
    async (id: number, thunkApi) => {
        const resData = await deleteBlogService(id);
        thunkApi.dispatch(getAllBlog());
        return resData;
    }
);

export interface blogState {
    listBlog: Blog[];
    loading: boolean;
    loadingApi: boolean;
}

const initialState: blogState = {
    listBlog: [] as Blog[],
    loading: false,
    loadingApi: false,
};

export const blogSlice = createSlice({
    name: "blogSlice",
    initialState,
    reducers: {
        oke: (state, action: PayloadAction<boolean>) => {},
    },
    extraReducers: {
        [getAllBlog.pending.toString()]: (state) => {
            state.loading = true;
        },
        [getAllBlog.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
            state.listBlog = action.payload;
        },
        [getAllBlog.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
        },
        //////////////////////////////////////////////////////////////////
        [createBlog.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [createBlog.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Thêm bản ghi thành công!!!");
        },
        [createBlog.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Thêm bản ghi lỗi.");
        },
        //////////////////////////////////////////////////////////////////
        [deleteBlog.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [deleteBlog.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Xóa bản ghi thành công.");
        },
        [deleteBlog.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Xóa bản ghi lỗi.");
        },
        //////////////////////////////////////////////////////////////////
        [updateBlog.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [updateBlog.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Cập nhật bản ghi thành công.");
        },
        [updateBlog.rejected.toString()]: (
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
export const { oke } = blogSlice.actions;
export default blogSlice.reducer;
