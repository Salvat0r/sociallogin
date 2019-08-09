import { IS_MOBILE, GET_ORIENTATION, LOADING_USERS, GET_USERS, LOADING_USER, GET_USER, POSTING_USER, POST_USER, USER_UPDATE, UPDATE_SCORES, SCORE_SHARE} from './constType';
import Users from '../apis/Users';

export const getUsersAction = () => async dispatch => {
    dispatch({ 
        type: LOADING_USERS 
    });
    return await Users.get('/read.php')
    .then(response => {
        dispatch({
            type: GET_USERS,
            payload: response.data.records
        });
        if(response.data.records){
            dispatch({
                type: UPDATE_SCORES,
                payload: response.data.records.length
            })
        }
    });
}

export const getUserAction = (id) => async dispatch => {
    dispatch({ type: LOADING_USER });
    const promise = await Users.get('/readUser.php?provider_id=' + id);
    dispatch({
        type: GET_USER,
        payload: promise.data
    });
}

export const postUserAction = (data) => async dispatch => {
    dispatch({type: POSTING_USER});
    return await Users.post('/create.php', data )
    .then((response)=>{
        dispatch({
            type: POST_USER,
            payload: response.data.utente
        });
        sessionStorage.setItem("userData", JSON.stringify(data));
    });
}

export const updateUserAction = (provider_id) => async dispatch => {
    const promise = await Users.post('/update.php', {provider_id: provider_id});
    dispatch({
        type: USER_UPDATE,
        payload: promise.data
    });
}

export const scoreShareAction = (scoreShare) => async dispatch => {
    dispatch({
        type: SCORE_SHARE,
        payload: scoreShare
    });
}

export const getOrientationAction = () => async dispatch => {
    dispatch({
        type: GET_ORIENTATION
    });
}

export const isMobileAction = () => async dispatch => {
    dispatch({
        type: IS_MOBILE
    });
}