import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../interface";
import {
    createProductService,
    deleteProductService,
    getAllProductService,
    updateProductService,
} from "../../service/api/productService";

import { notiError, notiSuccess } from "../../utils/notification";

export const getAllProduct = createAsyncThunk("getAllProduct", async () => {
    const resData = await getAllProductService();
    return resData;
});

export const createProduct = createAsyncThunk(
    "createProduct",
    async (data: any, thunkApi) => {
        const { name, imageFile, description, category_id, options, sale } =
            data;
        const optionPut = {
            size: [...options],
        };
        const bodyData = new FormData();
        bodyData.append("thumb", imageFile);
        bodyData.append("name", name);
        bodyData.append("category_id", category_id);
        bodyData.append("product_content", "1");
        bodyData.append("has_option", "1");
        bodyData.append("price_sale", "0");
        bodyData.append("price", "0");
        bodyData.append("description", description);
        const resData = await createProductService(bodyData);

        await updateProductService(resData.id, {
            name,
            sale,
            category_id,
            has_option: 1,
            price: 0,
            price_sale: 0,
            product_content: "1",
            options: optionPut,
            _method: "put",
        });
        thunkApi.dispatch(getAllProduct());
        return resData;
    }
);

export const updateProduct = createAsyncThunk(
    "updateProduct",
    async (data: any, thunkApi) => {
        const { id, name, imageFile, description, category_id, options, sale } =
            data;
        const optionPut = {
            size: [...options],
        };
        const bodyData = new FormData();
        if (imageFile) {
            bodyData.append("thumb", imageFile);
            bodyData.append("name", name);
            bodyData.append("category_id", category_id);
            bodyData.append("product_content", "1");
            bodyData.append("has_option", "1");
            bodyData.append("price_sale", "0");
            bodyData.append("price", "0");
            bodyData.append("description", description);
            bodyData.append("_method", "put");
            await updateProductService(id, bodyData);
        }
        thunkApi.dispatch(getAllProduct());
        const updateData = {
            name,
            sale,
            description,
            category_id,
            has_option: 1,
            price: 0,
            price_sale: 0,
            product_content: "1",
            options: optionPut,
            _method: "put",
        };
        const resData = await updateProductService(id, updateData);
        return resData;
    }
);

export const deleteProduct = createAsyncThunk(
    "deleteProduct",
    async (id: number, thunkApi) => {
        const resData = await deleteProductService(id);
        thunkApi.dispatch(getAllProduct());
        return resData;
    }
);

export interface ProductState {
    listProduct: Product[];
    loading: boolean;
    loadingApi: boolean;
}

const initialState: ProductState = {
    listProduct: [] as Product[],
    loading: false,
    loadingApi: false,
};

export const productSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {
        oke: (state, action: PayloadAction<boolean>) => {},
    },
    extraReducers: {
        [getAllProduct.pending.toString()]: (state) => {
            state.loading = true;
        },
        [getAllProduct.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
            state.listProduct = action.payload;
        },
        [getAllProduct.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
        },
        //////////////////////////////////////////////////////////////////
        [createProduct.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [createProduct.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("Th??m b???n ghi th??nh c??ng!!!");
        },
        [createProduct.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("Th??m b???n ghi l???i.");
        },
        //////////////////////////////////////////////////////////////////
        [deleteProduct.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [deleteProduct.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("X??a b???n ghi th??nh c??ng.");
        },
        [deleteProduct.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiError("X??a b???n ghi l???i.");
        },
        //////////////////////////////////////////////////////////////////
        [updateProduct.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [updateProduct.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loadingApi = false;
            notiSuccess("C???p nh???t b???n ghi th??nh c??ng.");
        },
        [updateProduct.rejected.toString()]: (
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
export const { oke } = productSlice.actions;
export default productSlice.reducer;
