import { IReduxAction } from 'interfaces/common';
import { createReducers } from 'lib/redux';
import { showDrawer, toggleDrawer } from './actions';
import { merge } from 'lodash';

const initialState = {
  showDrawer: false,
  hasTouchedDrawer: false
};

const appNavReducers = [
  {
    on: toggleDrawer,
    reducer(state: any) {
      return {
        ...state,
        showDrawer: !state.showDrawer
      };
    }
  },
  {
    on: showDrawer,
    reducer(state, data: IReduxAction<any>) {
      return {
        ...state,
        showDrawer: data.payload,
        hasTouchedDrawer: true
      };
    }
  }
];

export default merge(
  {},
  createReducers('appNav', [appNavReducers], initialState)
);
