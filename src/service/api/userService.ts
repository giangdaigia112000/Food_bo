import axiosClient from "../axiosClient";

export const getAllUserService = async () => {
    const res = await axiosClient.post("/api/admin/list-user", {
        _method: "get",
    });
    return res.data;
};

export const deleteUserService = async (id: number) => {
    const res = await axiosClient.post(`/api/admin/delete-member`, {
        id: id,
    });
    return res.data;
};

export const createUserService = async (data: any) => {
    const res = await axiosClient.post("/api/admin/create-member", data);
    return res.data;
};

export const getDetailUserService = async (id: number) => {
    const res = await axiosClient.post(`/api/admin/detail-user`, {
        id: id,
    });
    return res.data;
};
