import {axiosM, axiosG} from "@/api/request";

const getRunListUrl = "run/pageCallRun?"; // 获得约跑列表
const checkRunUrl = "run/check"; // 审核约跑
const delCallRunUrl = "run/delCallRun"; // 删除约跑

export const getRunListApi = data => axiosG(getRunListUrl + data);
export const checkRunApi = data => axiosM(checkRunUrl, data, 'put');
export const delCallRunApi = data => axiosM(delCallRunUrl, data, 'delete');
