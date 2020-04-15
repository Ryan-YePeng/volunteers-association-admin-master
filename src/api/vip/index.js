import {axiosM, axiosG, axiosL} from "@/api/request";

const getUserListUrl = "admin/user/pageUser?"; // 获得用户列表
const downloadUserUrl = "userDetail/downloadUser"; // 获得用户列表
const userCheckUrl = "userDetail/userCheck"; // 获得用户列表

export const getUserListApi = data => axiosG(getUserListUrl + data);
export const downloadUserApi = () => axiosL(downloadUserUrl);
export const userCheckApi = data => axiosM(userCheckUrl, data, 'put');
