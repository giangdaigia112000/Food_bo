import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chart } from "../../interface";
import { getChartService } from "../../service/api/chartService";

import { notiError, notiSuccess } from "../../utils/notification";

export const getAllChart = createAsyncThunk(
    "getAllChart",
    async (month: number) => {
        const resData = await getChartService(month);
        return resData;
    }
);

export interface chartState {
    allChart: Chart | null;
    loading: boolean;
}

const initialState: chartState = {
    allChart: null,
    loading: false,
};

export const chartSlice = createSlice({
    name: "chartSlice",
    initialState,
    reducers: {
        oke: (state, action: PayloadAction<boolean>) => {},
    },
    extraReducers: {
        [getAllChart.pending.toString()]: (state) => {
            state.loading = true;
        },
        [getAllChart.fulfilled.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
            state.allChart = action.payload;
        },
        [getAllChart.rejected.toString()]: (
            state,
            action: PayloadAction<any>
        ) => {
            state.loading = false;
        },
    },
});

// Action creators are generated for each case reducer function
export const { oke } = chartSlice.actions;
export default chartSlice.reducer;
