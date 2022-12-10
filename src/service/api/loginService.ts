import axiosClient from "../axiosClient";

export const loginService = async (data: any) => {
    const res = await axiosClient.post("api/auth/login", {
        ...data,
    });
    return res.data;
};

export const checkMeService = async () => {
    const res = await axiosClient.post("api/get-me", {
        _method: "get",
    });
    return res.data;
};

export const changePasswordService = async (data: any) => {
    const res = await axiosClient.post("api/change-password", {
        ...data,
    });
    return res.data;
};
