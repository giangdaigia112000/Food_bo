import axiosClient from "../axiosClient";

export const getAllOrderService = async () => {
    const res = await axiosClient.post("/api/admin/order", {});
    return res.data;
};

export const updateOrderService = async (id: number, data: any) => {
    const res = await axiosClient.post(`/api/admin/order/${id}`, {
        ...data,
    });
    return res.data;
};
