/**
 * author: niuxiaoyu
 * description: 单元
 * date: 2018/6/6
 */

import {TEST_TWO} from './constant'


const initialState = {
  dataList: [],
  isLoading: false,
  error: '',
  num:222
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case TEST_TWO:
      return Object.assign({}, state, {
        // num: action.payload,
      });
    default:
      return state;
  }
}





