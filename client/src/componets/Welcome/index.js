import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { postUserAction } from '../../actions';

class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginError: false,
            redirect: false
        };
        this.signup = this.signup.bind(this);
    }

    signup(res, type) {
        let postData;
        if (type === 'facebook' && res.email) {
            postData = {
                name: res.name,
                provider: type,
                email: res.email,
                provider_id: res.id,
                token: res.accessToken,
                provider_pic: res.picture.data.url
            };
        }

        if (type === 'google' && res.w3.U3) {
            postData = {
                name: res.w3.ig,
                provider: type,
                email: res.w3.U3,
                provider_id: res.El,
                token: res.Zi.access_token,
                provider_pic: res.w3.Paa
            };
        }

        if (postData) {
            this.props.postUserAction(postData)
            .then((result) => {
                let responseJson = result;
                sessionStorage.setItem("userData", JSON.stringify(responseJson.payload));
                this.setState({ redirect: true });
            });
        } else {
            console.log('Errore nel reperimento info login');
         }
    }

    render() {

        if (this.state.redirect || sessionStorage.getItem('userData')) {
            return (<Redirect to={'/home'} />)
        }

        const responseFacebook = (response) => {
            this.signup(response, 'facebook');
        }

        const responseGoogle = (response) => {
            this.signup(response, 'google');
        }

        return (
            <div>
                <FacebookLogin
                    appId="343261613289251"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                />
                <br /><br />
                <GoogleLogin
                    clientId="513341065240-jti9omgfpj1opa1gckvmg9fld9d8ii7n.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle} 
                />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    //console.log(state);
    return {
        post_user: state.post_user
    }
}

export default connect(mapStateToProps, { postUserAction })(Welcome);