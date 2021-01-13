import {TEST_TWO} from './constant'
import http from "common/http";

export const testFengTwo = (num) => ({ type: TEST_TWO, payload: num });


// export const deleteUser = (params={}, callback=noop, queue="deleteUser") => dispatch => {
//     http.postForm({
//         url: '/admin/users/delete.json',
//         params: params,
//         queue: queue,
//         callback: callback
//     });
// };
//
// export const loadData = (params={}, queue='loadUsersData') => dispatch => {
//     http.get({
//         url: '/admin/users/list.json',
//         params: params,
//         queue: queue,
//         callback: (res) => {
//             dispatch(setDataList(res));
//         }
//     });
// };
