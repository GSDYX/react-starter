import {ADD_QUEUE, REMOVE_QUEUE} from './constant';

export const addToQueue = (queueName) => ({
    type: ADD_QUEUE,
    payload: queueName
});

export const removeFromQueue = (queueName) => ({
    type: REMOVE_QUEUE,
    payload: queueName
});