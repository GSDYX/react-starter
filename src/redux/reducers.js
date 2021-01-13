import { combineReducers } from 'redux';

import skuunit from '../routers/Skuunit/redux/reducer';
import two from '../routers/Two/redux/reducer';
import http from "common/http/redux/reducer";
import cache from "common/cache/redux/reducer";

const reducers = {
  skuunit,
  two,
  http,
  cache
};

export default combineReducers(reducers);
