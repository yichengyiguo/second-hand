import { combineReducers } from "redux";
import products from './products';
import user from './user';
import publish from './publish'

const secondHandApp = combineReducers({
  products,
  user,
  publish
})

export default secondHandApp;
