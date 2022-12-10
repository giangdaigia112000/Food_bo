import axiosClient from "../axiosClient";

export const getAllCategoryService = async () => {
    const res = await axiosClient.post("/api/admin/category", {
        _method: "get",
    });
    return res.data;
};

export const deleteCategoryService = async (id: number) => {
    const res = await axiosClient.post(`/api/admin/category/${id}`, {
        _method: "delete",
    });
    return res.data;
};

export const createCategoryService = async (data: any) => {
    const res = await axiosClient.post("/api/admin/category", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const updateCategoryService = async (id: number, data: any) => {
    const res = await axiosClient.post(`/api/admin/category/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
