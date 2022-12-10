import axiosClient from "../axiosClient";

export const getAllShopService = async () => {
    const res = await axiosClient.post("/api/admin/shop", {
        _method: "get",
    });
    return res.data;
};

export const deleteShopService = async (id: number) => {
    const res = await axiosClient.post(`/api/admin/shop/${id}`, {
        _method: "delete",
    });
    return res.data;
};

export const createShopService = async (data: any) => {
    const res = await axiosClient.post("/api/admin/shop", data);
    return res.data;
};

export const updateShopService = async (id: number, data: any) => {
    const res = await axiosClient.post(`/api/admin/shop/${id}`, data);
    return res.data;
};
