import {get, isEmpty} from 'lodash';
import qs from 'querystring';

export const TOKEN_KEY = "BQS_CNET_WEB_TOKEN";
export const USER_INFO = "BQS_CNET_WEB_USER_INFO";
export const LOGGED_IN_STATUS = 'BQS_CNET_LOGGED_IN';

export const OPER_LAST_TIME = "BQS_CNET_OPER_LAST_TIME";

export const RESULT_CODE_SUCCESS = "CNET000";
export const RESULT_CODE_FORBIDDEN = "CNET004";
export const RESULT_CODE_SYS_ERROR = "CNET999";

// 过期超时,3h
export const EXPIRE_TIME_OUT = 3 * 60 * 60 * 1000;

/**
 * 创建action
 * @param type
 * @returns {function(*): string}
 */
export const createAction = type => name => (type + "_" + name);

/**
 * 获取url的query参数集
 * @returns {*} 参数k-v
 */
export const getUrlParams = () => {
    let search = window.location.search.substr(1);
    return qs.parse(search);
};

/**
 * 根据参数生成url参数
 * @param params
 * @returns {string}
 */
export const createUrlParams = (params) => {
    return "?" + qs.stringify(params);
}

/**
 * 空操作函数
 * @type {Function}
 */
export const noop = (() => {});

/**
 * 解析错误请求响应对象
 * @param errorRsp
 * @returns {{data: (*|{}), httpStatus: *, url: *}}
 */
export const getErrorRsp = errorRsp => {
    return {
        url: get(errorRsp, "config.url"),
        httpStatus: get(errorRsp, "response.status"),
        data: get(errorRsp, "response.data") || {},
    }
};

/**
 * 后端校验错误信息反馈到Form组件
 * @param data
 * @param setFields
 */
export const setFieldErrors = (data, setFields) => {
    // 遍历后端表单校验失败结果并展示
    let fieldErrors = get(data, "data.fieldErrors");
    if (!fieldErrors) {
        return;
    }
    for (let name in fieldErrors) {
        // 提取转换错误提示
        let errorMsg = fieldErrors[name];
        if (errorMsg && errorMsg.indexOf("|") !== -1) {
            errorMsg = errorMsg.split('|')[1];
        }
        let errorTips = {};
        errorTips[name] = {errors: [new Error(errorMsg)]};
        setFields(errorTips);
    }
};

/**
 * 设置请求操作的最后记录时间
 */
export const setOperateLastTime = () => {
    let nowTime = new Date().getTime();
    window.localStorage.setItem(OPER_LAST_TIME, nowTime);
};
/**
 * 获取请求操作的最后记录时间
 * @returns {string|number}
 */
export const getOperateLastTime = () => {
    let time = window.localStorage.getItem(OPER_LAST_TIME);
    if (!time) {
        return 0;
    }
    return time;
};

/**
 * 设置登录信息
 * @param loginData
 */
export const setLoginInfo = (loginData) => {
    if (loginData.token) {
        window.localStorage.setItem(TOKEN_KEY, loginData.token);
        delete loginData.token;
        // save store time, check for expire
        loginData.storeTime = new Date().getTime();
        window.localStorage.setItem(USER_INFO, JSON.stringify(loginData));
        window.localStorage.setItem(LOGGED_IN_STATUS, true);
    } else {
        logOut(); // token空，当做清空处理先
    }
};

/**
 * 刷新登录token
 * @param newToken
 */
export const refreshToken = (newToken) => {
    if (!newToken) {
        return;
    }
    window.localStorage.setItem(TOKEN_KEY, newToken);
    // 更新过期时间
    let data = window.localStorage.getItem(USER_INFO);
    if (data) {
        let userInfo = JSON.parse(data);
        userInfo.storeTime = new Date().getTime();
        window.localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
    }
};

/**
 * 获取登录用户数据
 * @returns {{}|any}
 */
export const getLoginUserInfo = () => {
    if (!getLoggedInStatus()) {
        return {};
    }
    let data = window.localStorage.getItem(USER_INFO);
    if (!data) {
        return {};
    }
    return JSON.parse(data);
};

/**
 * 修改登录用户数据
 * @param info
 */
export const modifyLoginUserInfo = (info) => {
    if (!getLoggedInStatus()) {
        return;
    }
    window.localStorage.setItem(USER_INFO, JSON.stringify(info));
};

/**
 * 获取登录用户token
 * @returns {string|null}
 */
export const getLoginAccessToken = () => {
    if (!getLoggedInStatus()) {
        return null;
    }
    return window.localStorage.getItem(TOKEN_KEY);
};

/**
 * 获取登录状态
 */
export const getLoggedInStatus = () => {
    let status = window.localStorage.getItem(LOGGED_IN_STATUS);
    if (!status) {
        return false;
    }
    // token expire check
    let data = window.localStorage.getItem(USER_INFO);
    if (data) {
        let userInfo = JSON.parse(data);
        let timeNow = new Date().getTime();
        if (userInfo.storeTime + EXPIRE_TIME_OUT < timeNow) {
            logOut();
            return false;
        }
    }
    return window.localStorage.getItem(LOGGED_IN_STATUS);
};

/**
 * 登出系统，释放本地数据
 */
export const logOut = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_INFO);
    window.localStorage.removeItem(LOGGED_IN_STATUS);
    sessionStorage.clear();
};

/**
 * 格式化秒
 * @param value
 * @returns {{result: *, resultTip: *}}
 */
export const formatSeconds = (value) => {
    let theTime = parseInt(value);// 需要转换的时间秒
    let theTime1 = 0;// 分
    let theTime2 = 0;// 小时
    let theTime3 = 0;// 天
    if(theTime > 60) {
        theTime1 = parseInt(theTime/60);
        theTime = parseInt(theTime%60);
        if(theTime1 > 60) {
            theTime2 = parseInt(theTime1/60);
            theTime1 = parseInt(theTime1%60);
            // if(theTime2 > 24){
            //     //大于24小时
            //     theTime3 = parseInt(theTime2/24);
            //     theTime2 = parseInt(theTime2%24);
            // }
        }
    }
    // 秒
    let timeSec = convertTimeInt(theTime);
    let resultTip = timeSec + "秒";
    let result = timeSec;
    if (timeSec < 10) {
        result = "0" + result;
    }
    // 分
    let timeMinute = convertTimeInt(theTime1);
    result = timeMinute + ":" + result;
    if (timeMinute < 10) {
        result = "0" + result;
    }
    if (timeMinute > 0) {
        resultTip = timeMinute + "分" + resultTip;
    }
    // 小时
    let timeHour = convertTimeInt(theTime2);
    result = timeHour + ":" +result;
    if (timeHour < 10) {
        result = "0" + result;
    }
    if (timeHour > 0) {
        resultTip = timeHour + "小时" + resultTip;
    }
    return {
        result: result,
        resultTip: resultTip
    };
};

const convertTimeInt = (value) => {
    if(value > 0) {
        return parseInt(value);
    }
    return 0;
};

const graphStoreTypeRef = {
    "COUNT": "总个数",
    "DISTANCE": "距离"
};
const graphPropConditionRef = {
    "E":"等于",
    "NE":"不等于",
    "GT":"大于",
    "LT":"小于",
    "GTE":"大于等于",
    "LTE":"小于等于"
};
const numberBaseRef = {
    "1":"一",
    "2":"二",
    "3":"三",
    "4":"四",
    "5":"五",
    "6":"六",
    "7":"七",
    "8":"八",
    "9":"九"
};
/**
 * 指标预览内容生成；参数为添加指标请求对象
 * @param ruleVo
 * @returns {string}
 */
export const previewRuleName = (ruleVo) => {
    // 基础结构
    let baseLabel = get(ruleVo, "baseLabel", null);
    let storeType = get(ruleVo, "storeType");
    if (!baseLabel) {
        return "请选择指标条件";
    }

    // 条件解析
    let conditionTips = "";
    let conditionsStr = get(ruleVo, "conditions");
    if (conditionsStr) {
        let conditions = JSON.parse(conditionsStr);
        if (conditions instanceof Array) {
            let condTips = [];
            conditions.forEach(cond => condTips.push(resolveRuleCondition(cond)));
            conditionTips = condTips.join("关联");
        } else {
            return "请选择指标条件";
        }
    }

    return `计算${baseLabel}${conditionTips}的${graphStoreTypeRef[storeType]}`;
};

const resolveRuleCondition = (cond) => {
    // 条件对象
    let dimension = get(cond, "graphDimension");
    let depth = get(cond, "graphDepth");
    let label = get(cond, "label");
    let centerLabel = get(cond, "centerLabel");
    let conditions = get(cond, "conditions");
    // 非子网条件的维度提示文字切换适配
    let dimensionTip = "所在子网";
    if (dimension !== 'SUB_NET') {
        if (dimension === 'WITHIN_DEGREE') {
            dimensionTip = `${numberBaseRef[depth] || depth}度内`;
        } else {
            dimensionTip = `第${numberBaseRef[depth] || depth}度`;
        }
    }
    // 中心节点界定
    let labelTip = "";
    if (centerLabel) {
        labelTip = "与中心节点";
    } else {
        labelTip = isEmpty(label) ? '所有点' : `${label}类型点`;
    }
    // 属性匹配逻辑
    let conditionTips = "";
    if (conditions && conditions instanceof Array) {
        let condTips = [];
        conditions.forEach(cond => condTips.push(resolvePropCondition(cond)));
        conditionTips = "满足" + condTips.join("且");
    }

    return `${dimensionTip}${labelTip}${conditionTips}`;
};
const resolvePropCondition = (cond) => {
    let propKey = get(cond, "propKey");
    let condition = get(cond, "condition");
    let value = get(cond, "value");
    // boolean check
    if (["E","NE"].indexOf(condition) !== -1 &&
         (value === 'true' || value === 'false')) {
        return `${value === 'true' ? "是":"不是"}${propKey}`;
    }

    return `${propKey}${graphPropConditionRef[condition]}${value}`;
};