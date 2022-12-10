import axiosClient from "../axiosClient";

export const getAllVoucherService = async () => {
    const res = await axiosClient.post("/api/admin/voucher-use", {
        _method: "get",
    });
    return res.data;
};

export const deleteVoucherService = async (id: number) => {
    const res = await axiosClient.post(`/api/admin/voucher/${id}`, {
        _method: "delete",
    });
    return res.data;
};

export const createVoucherService = async (data: any) => {
    const res = await axiosClient.post("/api/admin/voucher", data);
    return res.data;
};

export const updateVoucherService = async (id: number, data: any) => {
    const res = await axiosClient.post(`/api/admin/voucher/${id}`, {
        ...data,
        _method: "put",
    });
    return res.data;
};

export const getDetailUserService = async (id: number) => {
    const res = await axiosClient.post(`/api/admin/detail-user`, {
        id: id,
    });
    return res.data;
};
