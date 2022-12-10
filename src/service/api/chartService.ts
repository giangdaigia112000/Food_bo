import axiosClient from "../axiosClient";

export const getChartService = async (month: number) => {
    const res = await axiosClient.post("/api/admin/dashboard", {
        month: month,
        _method: "get",
    });
    return res.data;
};
