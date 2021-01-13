import {SET_USER_DATA} from "common/cache/redux/constant";

export default (state = initialData, action) => {
    switch (action.type) {
        case SET_USER_DATA: {
            let data = action.payload;
            return {
                ...state,
                perm: get(data, 'perm', [])
            }
        }
        default:
            return state;
    }
}
