/**
 * author: niuxiaoyu
 * description: 单元
 * date: 2018/6/6
 */

import {TEST} from './constant'


const initialState = {
  dataList: [],
  isLoading: false,
  error: '',
  num: 1,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case TEST:
      return Object.assign({}, state, {
        num: action.payload,
      });
    default:
      return state;
  }
}





