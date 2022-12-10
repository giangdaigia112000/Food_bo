import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../interface";
import {
    changePasswordService,
    checkMeService,
    loginService,
} from "../../service/api/loginService";
import {
    getStoreLocal,
    removeStoreLocal,
    setStoreLocal,
} from "../../utils/localStore";
import { notiError, notiSuccess } from "../../utils/notification";

export const checkMe = createAsyncThunk("checkMe", async () => {
    const resData = await checkMeService();
    return resData;
});

export const login = createAsyncThunk("login", async (data: any, thunkAPI) => {
    const resData = await loginService(data);
    setStoreLocal("token", resData.token as string);
    return resData;
});

export const changePassword = createAsyncThunk(
    "changePassword",
    async (data: any, thunkAPI) => {
        const { old_password, password, password_confirmation } = data;
        const resData = await changePasswordService({
            old_password,
            password,
            password_confirmation,
        });
        return resData;
    }
);
export interface LoginState {
    isLogin: boolean;
    user: User | null;
    loading: boolean;
    loadingApi: boolean;
}

const initialState: LoginState = {
    isLogin: false,
    user: null,
    loading: false,
    loadingApi: false,
};

export const LoginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        logOut: (state) => {
            removeStoreLocal("token");
            state.isLogin = false;
            state.user = null;
        },
    },
    extraReducers: {
        [checkMe.pending.toString()]: (state) => {
            state.loading = true;
        },
        [checkMe.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.user = action.payload as User;
            state.isLogin = true;
            notiSuccess("Đăng nhập thành công.");
        },
        [checkMe.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loading = false;
            removeStoreLocal("token");
        },
        //////////////////////////////////////////////////////////////////
        [login.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [login.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApi = false;
            state.user = action.payload.user as User;
            state.isLogin = true;
        },
        [login.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApi = false;
            notiError("Đăng nhập thất bại.");
        },
        //////////////////////////////////////////////////////////////////
        [changePassword.pending.toString()]: (state) => {
            state.loadingApi = true;
        },
        [changePassword.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            notiSuccess("Đổi mật khẩu thành công");
            state.loadingApi = false;
        },
        [changePassword.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            notiError("Đổi mật khẩu thất bại.");
            state.loadingApi = false;
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { logOut } = LoginSlice.actions;
export default LoginSlice.reducer;
