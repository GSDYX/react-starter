import axios from 'axios';
import qs from 'querystring';
import {isEmpty} from 'lodash';
import store from './../../redux'; // 引用store用于dispatch请求状态
import {addToQueue, removeFromQueue} from './redux/action'; // 请求状态控制action

const CONTENT_TYPE_FORM = { 'Content-Type':'application/x-www-form-urlencoded' };

/**
 * http请求封装类
 */
export default class http {

    /**
     * 发起get请求
     * @param _params {{callback: callback, params: *, url: string, queue: *}} 定义参数
     */
    static async get(_params) {
        let url = _params.url;
        let params = _params.params;
        let queue = _params.queue;
        let callback = _params.callback || (() => {});

        let query = isEmpty(params) ? null : qs.stringify(params);
        if (query) {
            url = url + '?' + query;
        }

        try {
            queue && store.dispatch(addToQueue(queue));
            let data = await axios.get(url);
            callback(data);
        } catch (e) {
            //ignore
        } finally {
            queue && store.dispatch(removeFromQueue(queue))
        }
    }

    /**
     * 发起post请求
     * @param _params {{callback: callback, params: *, url: string, queue: *}} 参数定义
     */
    static async post(_params) {
        let url = _params.url;
        let params = _params.params || {};
        let queue = _params.queue;
        let callback = _params.callback || (() => {});

        try {
            queue && store.dispatch(addToQueue(queue));
            let data = await axios.post(url, params);
            callback(data);
        } catch (e) {
            callback("请求失败");
        } finally {
            queue && store.dispatch(removeFromQueue(queue));
        }
    }

    /**
     * 发起post请求，以form表达形式提交
     * @param _params {{callback: callback, params: *, url: string, queue: *}} 参数定义
     */
    static async postForm(_params) {
        let url = _params.url;
        let params = _params.params || {};
        let queue = _params.queue;
        let callback = _params.callback || (() => {});

        try {
            queue && store.dispatch(addToQueue(queue));
            let data = await axios.post(url, qs.stringify(params), {headers: CONTENT_TYPE_FORM});
            callback(data);
        } catch (e) {
            callback("请求失败");
        } finally {
            queue && store.dispatch(removeFromQueue(queue))
        }
    }

    /**
     * 发起post上传文件
     * @param _params {{callback: callback, params: *, url: string, queue: *}} 参数定义
     */
    static async postUpload(_params,config) {
        let url = _params.url;
        let params = _params.params || {};
        let queue = _params.queue;
        let callback = _params.callback || (() => {});

        try {
            queue && store.dispatch(addToQueue(queue));
            let data = await axios.post(url, params, config);
            callback(data);
        } catch (e) {
            //ignore
        } finally {
            queue && store.dispatch(removeFromQueue(queue))
        }
    }




}