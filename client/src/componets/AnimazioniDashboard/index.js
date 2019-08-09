import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { isMobileAction, getOrientationAction, getUsersAction, updateUserAction, getUserAction, scoreShareAction } from '../../actions';

import anime from 'animejs/lib/anime.es.js';

class AnimazioniDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    animationDataDashboard = () => {
        const { dashboard } = this.state;
        const kmRef = this.kmRef.current;
        const calRef = this.calRef.current;
        const perKmRef = this.perKmRef.current;
        const perCalRef = this.perCalRef.current;

        if (kmRef && dashboard.km) {

            var start = { dashboard: 0 };
            anime({
                targets: start,
                dashboard: dashboard.km,
                round: 1,
                easing: 'linear',
                update: function () {
                    kmRef.innerHTML = JSON.stringify(start.dashboard);
                },
                duration: 1000,
            });
            anime({
                targets: start,
                dashboard: dashboard.cal,
                round: 1,
                easing: 'linear',
                update: function () {
                    calRef.innerHTML = JSON.stringify(start.dashboard);
                },
                duration: 1000,
                delay: 500
            });
            var startPerc = { dashboard: '0%' };
            anime({
                targets: startPerc,
                dashboard: dashboard.kmPerc,
                round: 10,
                easing: 'linear',
                update: function () {
                    perKmRef.innerHTML = JSON.stringify(startPerc.dashboard);
                },
                duration: 1000,
                delay: 1500
            });
            anime({
                targets: startPerc,
                dashboard: dashboard.calPerc,
                round: 10,
                easing: 'linear',
                update: function () {
                    perCalRef.innerHTML = JSON.stringify(startPerc.dashboard);
                },
                duration: 1000,
                delay: 1800
            });
        }

    }

    render() {
        return (

        );
    }
}

const mapStateToProps = (state) => {
    return {
        default: state.default,
        users: state.users,
        getUser: state.getUser,
        update: state.updateUser,
        score: state.score,
        scoreShare: state.scoreShare,
        orientation: state.orientation,
        isMobile: state.isMobile
    }
}

export default connect(
    mapStateToProps, {
        getUsersAction,
        updateUserAction,
        getUserAction,
        scoreShareAction,
        getOrientationAction,
        isMobileAction
    })(AnimazioniDashboard);