import { combineReducers } from 'redux';

import { LOADING_USERS, GET_USERS, POST_USER } from '../actions/constType';

const initialState = {

};

const getUsersReducer = (state = {}, action) => {
    switch (action.type) {
        case LOADING_USERS:
            return state
        case GET_USERS:
            return action.payload.records
        default:
            return state
    }
};

const postUserReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_USER:
            return action.payload
        default:
            return state
    }
};

export default combineReducers({
    users: getUsersReducer,
    messagePostUsers: postUserReducer
})