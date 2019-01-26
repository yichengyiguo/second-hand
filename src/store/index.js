import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import secondHandApp from '../Reducers/index';

let store = createStore(
  secondHandApp,
  applyMiddleware(
    thunkMiddleware,
    createLogger
  )
);
export default store;
