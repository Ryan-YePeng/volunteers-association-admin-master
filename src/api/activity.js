import {axiosD, axiosG, axiosK, axiosP} from "./request";

const addActivityUrl = "article/addActivity"; // 添加活动
const addActivityApplyUrl = "article/addActivityApply"; // 添加活动报名列表
const delActivityUrl = "article/delActivity?id="; // 删除活动
const editActivityUrl = "article/editActivity"; // 编辑活动
const getArticleUrl = "article/getArticle?id="; // 获得活动详情
const pageActivityUrl = "article/pageActivity?"; //分页获得活动列表

export const addActivityApi = data => axiosK(addActivityUrl, data);
export const addActivityApplyApi = data => axiosK(addActivityApplyUrl, data);
export const delActivityApi = data => axiosD(delActivityUrl + data);
export const editActivityApi = data => axiosP(editActivityUrl, data);
export const pageActivityApi = data => axiosG(pageActivityUrl + data);


