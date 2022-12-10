import axiosClient from "../axiosClient";

export const getAllSlideService = async () => {
    const res = await axiosClient.post("/api/admin/slider", {
        _method: "get",
    });
    return res.data;
};

export const deleteSlideService = async (id: number) => {
    const res = await axiosClient.post(`/api/admin/slider/${id}`, {
        _method: "delete",
    });
    return res.data;
};

export const createSlideService = async (data: any) => {
    const res = await axiosClient.post("/api/admin/slider", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const updateSlideService = async (id: number, data: any) => {
    const res = await axiosClient.post(`/api/admin/slider/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
