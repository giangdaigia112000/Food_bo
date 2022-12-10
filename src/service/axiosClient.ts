import axios, { AxiosRequestConfig } from "axios";

const getStoreLocal = (item: string) => {
    if (typeof window !== "undefined") {
        return localStorage.getItem(item);
    }
};

const axiosClient = axios.create({
    baseURL: process.env.HOST_NAME_API,
    headers: {
        accept: "application/json",
    },
});

axiosClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const token = getStoreLocal("token") as string;
    config.headers = {
        Authorization: ` Bearer ${token}`,
    };
    return config;
});

export default axiosClient;
