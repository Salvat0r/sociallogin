import { combineReducers } from 'redux';
import { LOADING_USERS, GET_USERS, GET_USERS_FAILED, GET_USER, LOADING_USER, POSTING_USER, POST_USER, USER_UPDATE, UPDATE_SCORES, SCORE_SHARE } from '../actions/constType';

const initialState = {
    kmTot: 40075,
    kmUser: 57.3,
    calorie: 1000,
    calorieTotale: 1000000,
    nextStep: "ASIA",
    continenti: {
        asia: 200000,
        oceania: 200000,
        europa: 200000,
        africa: 200000,
        america: 200000
    }
};

const getUsersReducer = (state = {}, action) => {
    switch (action.type) {
        case LOADING_USERS:
            return state
        case GET_USERS:
            return Object.assign({}, state, action.payload)
        case GET_USERS_FAILED:
            return Object.assign({}, state, {
                status: "failed",
                error: action.payload,
            })
        default:
            return state
    }
};

const getUserReducer = (state = {}, action) => {
    switch (action.type) {
        case LOADING_USER:
            return state
        case GET_USER:
            return action.payload
        default:
            return state
    }
};

const postUserReducer = (state = {}, action) => {
    switch (action.type) {
        case POSTING_USER:
            return Object.assign({}, state, {
                status: "loading"
            })
        case POST_USER:
            return action.payload
        default:
            return state
    }
};

const updateUserReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE:
            return action.payload
        default:
            return state
    }
};

const defaultState = (state = initialState) => {
    return state
};

const updateScoresReducer = (state = 0, action ) => {
    switch (action.type) {
        case UPDATE_SCORES:
            return action.payload
        default:
            return state
    }
}

const scoreShareReducer = (state = 0, action) => {
    switch (action.type) {
        case SCORE_SHARE:
            return action.payload
        default:
            return state
    }
}


export default combineReducers({
    default: defaultState,
    users: getUsersReducer,
    getUser: getUserReducer,
    updateUser: updateUserReducer,
    score: updateScoresReducer,
    scoreShare: scoreShareReducer
})

        