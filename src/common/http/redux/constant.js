import {createAction} from "common/common";

let defineAction = createAction("HTTP");

export const ADD_QUEUE = defineAction("ADD_QUEUE");
export const REMOVE_QUEUE = defineAction("REMOVE_QUEUE");
