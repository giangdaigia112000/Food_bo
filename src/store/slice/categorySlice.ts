import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../interface";
import {
    createCategoryService,
    deleteCategoryService,
    getAllCategoryService,
    updateCategoryService,
} from "../../service/api/categoryService";

import { notiError, notiSuccess } from "../../utils/notification";

export const getAllCategory = createAsyncThunk("getAllSlide", async () => {
    const resData = await getAllCategoryService();
    return resData;
});

export const createCategory = createAsyncThunk(
    "createSlide",
    async (data: any, thunkApi) => {
        const { name, imageFile } = data;
        const bodyData = new FormData();
        bodyData.append("name", name);
        bodyData.append("thumb", imageFile);
        const resData = await createCategoryService(bodyData);
        thunkApi.dispatch(getAllCategory());
        return resData;
    }
);

export const updateCategory = createAsyncThunk(
    "updateSlide",
    async (data: any, thunkApi) => {
        const { id, name, imageFile } = data;
        const bodyData = new FormData();
        bodyData.append("name", name);
        bodyData.append("_method", "put");
        if (imageFile) bodyData.append("thumb", imageFile);
        const resData = await updateCategoryService(id, bodyData);
        thunkApi.dispatch(getAllCategory());
        return resData;
    }
);

export const deleteCategory = createAsyncThunk(
    "deleteSlide",
    async (id: number, thunkApi) => {
        const resData = await deleteCategoryService(id);
        thunkApi.dispatch(getAllCategory());
        return resData;
    }
);

export interface CateMovieState {
    listCategory: Category[];
    loading: boolean;
    loadingApi: boolean;
}

const initialState: CateMovieState = {
    listCategory: [] as Category[],
    loading: false,
    loadingApi: false,
};

export const categorySlice = createSlice({
    name: "categorySlice",
    initialState,
    reducers: {
        oke: (state, action: PayloadAction<boolean>) => {},
    },
    extraReducers: {
        [getAllCategory.pending.toString()]: (state) => {
            state.loading = true;
        },
        [getAllCategory.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
            state.listCategory = action.payload;
        },
        [getAllCategory.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
        },
        //////////////////////////////////////////////////////////////////
        [createCategory.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [createCategory.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Th??m b???n ghi th??nh c??ng!!!");
        },
        [createCategory.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Th??m b???n ghi l???i.");
        },
        //////////////////////////////////////////////////////////////////
        [deleteCategory.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [deleteCategory.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("X??a b???n ghi th??nh c??ng.");
        },
        [deleteCategory.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("X??a b???n ghi l???i.");
        },
        //////////////////////////////////////////////////////////////////
        [updateCategory.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [updateCategory.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("C???p nh???t b???n ghi th??nh c??ng.");
        },
        [updateCategory.rejected.toString()]: (
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
export const { oke } = categorySlice.actions;
export default categorySlice.reducer;
