import axiosClient from "../axiosClient";

export const getAllProductService = async () => {
    const res = await axiosClient.post("/api/admin/product", {
        _method: "get",
    });
    return res.data;
};

export const deleteProductService = async (id: number) => {
    const res = await axiosClient.post(`/api/admin/product/${id}`, {
        _method: "delete",
    });
    return res.data;
};

export const createProductService = async (data: any) => {
    const res = await axiosClient.post("/api/admin/product", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const updateProductService = async (id: number, data: any) => {
    const res = await axiosClient.post(`/api/admin/product/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
