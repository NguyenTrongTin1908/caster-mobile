import { combineReducers } from 'redux';
import { merge } from 'lodash';

// load reducer here
import auth from 'services/redux/auth/reducers';
import system from 'services/redux/system/reducers';
import user from 'services/redux/user/reducers';
import appNav from 'services/redux/app-nav/recuders';
import chat from 'services/redux/chatRoom/reducers'
import feed from 'services/redux/feed/reducers'


const reducers = merge(auth, system, user, appNav,chat,feed);

export default combineReducers(reducers);
