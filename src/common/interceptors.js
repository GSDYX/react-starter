import axios from 'axios'
import {Component} from 'react'
import {message} from '../components/bqs';
import {get} from 'lodash';
import {getLoginAccessToken, logOut, getErrorRsp, setOperateLastTime,
    RESULT_CODE_SUCCESS, RESULT_CODE_FORBIDDEN} from './common';

//将axios挂载到Component上，以供全局使用
Component.prototype.$axios = axios;

const baseURL = '/';
// 默认配置覆盖
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = baseURL;

// 请求处理拦截，全局添加token
axios.interceptors.request.use(config => {
    // 任意请求刷新本地记录的最后发起请求时间（用于自动刷新token控制）
    setOperateLastTime();
    const accessToken = getLoginAccessToken();
    if (accessToken) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${accessToken}`
        };
    }
    return config;
});


const ignoreResultPath = ["/admin/auth/login.json", "/admin/auth/refresh.json","/auth/login.json","/auth/refresh.json"];
const ignore401Path = ["/admin/auth/login.json"];
const ignoreErrorPath = ["/admin/auth/login.json", "/admin/auth/refresh.json"];

// 响应处理拦截器
axios.interceptors.response.use(response => {
    let url = get(response, "config.url");
    if (ignoreResultPath.indexOf(url) !== -1) {
        return response.data;
    }
    let code = response.data.code || 'CNET###';
    let msg = response.data.message || '未知异常';
    if (code === RESULT_CODE_SUCCESS) {
        return response.data.data; // 成功状态码直接返回成功结果data
    } else if (code === RESULT_CODE_FORBIDDEN) {
        window.location.href = '/no-permission';
    } else {
        // 非成功状态码返回异常结果，自动弹出异常信息提示
        message.error(`[GLOBAL] [${code}]${msg}`);
        return Promise.reject(response.data.data);
    }
}, errorRsp => {
    const {errCode, errMsg} = getErrMsg(errorRsp);
    const url = getErrorRsp(errorRsp).url;

    if (errCode === 401 && ignore401Path.indexOf(url) === -1) {
        message.error("[GLOBAL]登录失效，请重新登录。");
        logOut();
        window.location.href = "/login";
    } else if (ignoreErrorPath.indexOf(url) === -1) { // 排除过滤接口
        message.error("[GLOBAL]请求失败。" + errMsg);
    }

    return Promise.reject(errorRsp);
});

const ERR_CODE_LIST = { //常见错误码列表
    400: "请求错误",
    401: "登录失效或在其他地方已登录",
    403: "拒绝访问",
    404: "请求地址出错",
    408: "请求超时",
    500: "服务器内部错误",
    501: "服务未实现",
    502: "网关错误",
    503: "服务不可用",
    504: "网关超时",
    505: "HTTP版本不受支持"
};

export function getErrMsg(error) { //通过error处理错误码
    if(!error.response) {//无网络时单独处理
        return {errCode:null, errMsg:"网络不可用，请刷新重试"}
    }
    const errCode = error.response.status; //错误码
    const errMsg = ERR_CODE_LIST[errCode]; //错误消息
    let errReturnMsg = '';
    if (error.response.data) {
        errReturnMsg = error.response.data.message || '';
    }

    return {errCode: errCode, errMsg: errMsg ? `${errMsg} [${errCode}][${errReturnMsg}]` : error.message}
}