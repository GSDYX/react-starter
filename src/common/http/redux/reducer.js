import {ADD_QUEUE, REMOVE_QUEUE} from './constant';

const initialData = {
    queues: []
};

export default (state = initialData, action) => {
    switch (action.type) {
        case ADD_QUEUE: {
            let queues = state.queues;
            action.payload && queues.push(action.payload);
            return {
                ...state,
                queues: queues
            }
        }
        case REMOVE_QUEUE: {
            let queues = state.queues.filter(queue=>action.payload !== queue);
            return {
                ...state,
                queues: queues
            };
        }
        default:
            return state;
    }
}