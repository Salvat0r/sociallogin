import { LOADING_USERS, GET_USERS, POST_USER } from './constType';
import Users from '../apis/Users';

export const getUsersAction = () => async dispatch => {
    dispatch({ type: LOADING_USERS });
    const promise = await Users.get('/read.php');
    dispatch({
        type: GET_USERS,
        payload: promise.data
    });
}

export const postUserAction = (data) => async dispatch => {
    return await Users.post('/create.php', data )
        .then(response =>
            dispatch({
                type: POST_USER,
                payload: response.data.utente
            })
        );
}