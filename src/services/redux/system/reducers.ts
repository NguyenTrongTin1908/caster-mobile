import { IReduxAction } from 'src/interfaces';
import { createReducers } from 'lib/redux';
import { loadConfigSuccess, setConfig } from './actions';
import { merge } from 'lodash';

const initialState = {
  config: null
};

const configReducers = [
  {
    on: loadConfigSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        ...{ config: data.payload }
      };
    }
  },
  {
    on: setConfig,
    reducer: (state: any, data: IReduxAction) => ({
      ...state,
      ...data.payload
    })
  }
];

export default merge(
  {},
  createReducers('system', [configReducers], initialState)
);
