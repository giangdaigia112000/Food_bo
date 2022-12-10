import axiosClient from "../axiosClient";

export const getAllBlogService = async () => {
    const res = await axiosClient.post("/api/admin/post", {
        _method: "get",
    });
    return res.data;
};

export const deleteBlogService = async (id: number) => {
    const res = await axiosClient.post(`/api/admin/post/${id}`, {
        _method: "delete",
    });
    return res.data;
};

export const createBlogService = async (data: any) => {
    const res = await axiosClient.post("/api/admin/post", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const updateBlogService = async (id: number, data: any) => {
    const res = await axiosClient.post(`/api/admin/post/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
