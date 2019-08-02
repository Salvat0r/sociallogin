import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUsersAction } from '../../actions';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            redirect: false,
            users: {}
        };
    }

    componentDidMount() {
        let data = JSON.parse(sessionStorage.getItem('userData'));
        this.setState({ name: data.name })
        this.props.getUsersAction()
            .then(() => { 
                //Mostra Tutti Gli Utenti
                this.setState({ users: this.props.users })
            }
        );
    }

    displayUsers = () => {
        const { users } = this.state;
        if (users.length > 0 ) {
            console.log('trovato', users)
            const Emailutenti = users.map(user => 
                <p key={user.user_id}>{user.email}</p>
            )
            return Emailutenti;
        }
    }

    render() {

        if (!sessionStorage.getItem('userData') || this.state.redirect) {
            return (<Redirect to={'/'} />)
        }       

        return (            
            <div>
                Welcome {this.state.name}
                {this.displayUsers()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    //console.log(state);
    return {
        users: state.users
    }
}

export default connect(mapStateToProps, { getUsersAction })(Home);