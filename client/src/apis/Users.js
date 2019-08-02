import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost/SocialLogin/apis/users'
});