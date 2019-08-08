import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUsersAction, postUserAction } from '../../actions';

class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginError: false,
            redirect: false
        };
        this.signup = this.signup.bind(this);
    }

    componentDidMount() {
        this.props.getUsersAction();
    }

    signup(res, type) {

        const { users } = this.props;

        let postData;

        if (type === 'facebook' && res.email) {
            postData = {
                name: res.name,
                provider: type,
                email: res.email,
                provider_id: res.id,
                token: res.accessToken,
                provider_pic: res.picture.data.url,
                condividi: 0
            };
        }

        if (type === 'google' && res.w3.U3) {
            postData = {
                name: res.w3.ig,
                provider: type,
                email: res.w3.U3,
                provider_id: res.El,
                token: res.Zi.access_token,
                provider_pic: res.w3.Paa,
                condividi: 0
            };
        }

        if (postData) {
            //verifico se l'utente appena loggato è già presente tra gli utentsi sul DB
            let utenti = Object.values(users);

            console.log(utenti);

            const result = utenti.find((user) => user.provider_id === postData.provider_id);
            
            if ( result ) {
                sessionStorage.setItem("userData", JSON.stringify(postData));
                this.setState({redirect: true})
            } else { 
                this.props.postUserAction(postData).then(()=>{
                    this.setState({redirect: true})
                });                
            }
        } else {
            console.log('Errore nel reperimento info login');
        }

    }

    render() {

        const { redirect } = this.state;

        let data = JSON.parse(sessionStorage.getItem('userData'));

        if ( redirect && data.name ) {
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
    return {
        post_user: state.post_user,
        users: state.users,
        redirect: state.redirect
    }
}

export default connect(mapStateToProps, { getUsersAction, postUserAction })(Welcome);