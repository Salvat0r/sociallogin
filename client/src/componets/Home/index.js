import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { isMobileAction, getOrientationAction, getUsersAction, updateUserAction, getUserAction, scoreShareAction } from '../../actions';

import Share from '../Share';
import ProgressBar from '../ProgressBar';
import LoadingRotation from '../LoadingRotation';

import anime from 'animejs/lib/anime.es.js';

import { ReactComponent as Percorso } from '../../assets/percorso.svg';
import { ReactComponent as Mappa } from '../../assets/mappa.svg';
import { ReactComponent as PinBabbo } from '../../assets/pinbabbo.svg';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dashboard: {},
            nextStepDisplay: {},
            redirect: false,
            condiviso: false,
        };
        this.dashboardMeasure = this.dashboardMeasure.bind(this);
        this.displayNextStep = this.displayNextStep.bind(this);        
        this.countScoreShare = this.countScoreShare.bind(this); 

        this.kmRef = React.createRef();
        this.calRef = React.createRef();
        this.perKmRef = React.createRef();
        this.perCalRef = React.createRef();
    }

    componentDidMount() {   

        window.addEventListener("resize", this.animationCircuitoMappa);
        window.addEventListener('orientationchange', () => {
            this.props.getOrientationAction();
        });

        let data = JSON.parse(sessionStorage.getItem('userData'));
        this.props.getUsersAction()
        .then(()=>{
            this.countScoreShare();                
        });
        if( data && data.provider_id ) {
            this.props.getUserAction(data.provider_id);
        }

        this.animationCircuitoMappa();
        this.props.getOrientationAction();
        this.props.isMobileAction();
    }

    componentWillUnmount = () => {
        window.removeEventListener("resize", this.animationCircuitoMappa);
    }

    countScoreShare = () => {
        let { users } = this.props;
        let size = Object.keys(users).length;
        if (users && size > 0) {
            //calcola e somma tutte le cifre della colonna "condivisi"
            let totalShare = 0;
            for (const [key, value] of Object.entries(users)) {
                if(value.condividi == 1){
                    totalShare++;
                }
            }
            this.props.scoreShareAction(totalShare).then(()=>{
                this.dashboardMeasure();
                this.displayNextStep();       
            })
        }  
    }

    dashboardMeasure = () => {
        let { kmUser, kmTot, calorie, calorieTotale } = this.props.default;
        let { score, scoreShare } = this.props;
        let sommaScore = score + scoreShare;
        let km = Math.round(sommaScore * kmUser);
        let kmPerc = ((km / kmTot) * 100).toFixed(1);
        let cal = Math.round(sommaScore * calorie);
        let calPerc = ((cal / calorieTotale) * 100).toFixed(1);
        let kmMancanti = kmTot - km;
        return( 
            this.setState(prevState => ({
                dashboard: {                   
                    ...prevState.dashboard,
                    km: km,
                    kmPerc: kmPerc,
                    cal: cal,
                    calPerc: calPerc,
                    kmMancanti: kmMancanti
                }
            }))
        );
    }

    displayNextStep = () => {
        let { continenti } = this.props.default;
        let { dashboard } = this.state;
        let calPerc = dashboard.calPerc;
        if (calPerc < 20) {
            let dif = continenti.asia - dashboard.cal;
            return (
                this.setState(prevState => ({
                    nextStepDisplay: {
                        ...prevState.nextStepDisplay,
                        continente: "ASIA",
                        dif: dif
                    }
                }))
            );
        }
        if (calPerc < 40) {
            let dif = continenti.oceania - dashboard.cal;
            return (
                this.setState(prevState => ({
                    nextStepDisplay: {
                        ...prevState.nextStepDisplay,
                        continente: "OCEANIA",
                        dif: dif
                    }
                }))
            );
        }
        if (calPerc < 60) {
            let dif = continenti.europa - dashboard.cal;
            return (
                this.setState(prevState => ({
                    nextStepDisplay: {
                        ...prevState.nextStepDisplay,
                        continente: "EUROPA",
                        dif: dif
                    }
                }))
            );
        }
        if (calPerc < 80) {
            let dif = continenti.africa - dashboard.cal;
            return (
                this.setState(prevState => ({
                    nextStepDisplay: {
                        ...prevState.nextStepDisplay,
                        continente: "AFRICA",
                        dif: dif
                    }
                }))
            );
        }
        if (calPerc > 80) {
            let dif = continenti.america - dashboard.cal;
            return (
                this.setState(prevState => ({
                    nextStepDisplay: {
                        ...prevState.nextStepDisplay,
                        continente: "AMERICA",
                        dif: dif
                    }
                }))
            );
        }
    }

    shareHandler = () => {
        let { update, getUser } = this.props;
        if (getUser.condividi === "0" && !update.status === true) {
            this.props.updateUserAction(getUser.provider_id).then(()=>{
                this.setState({condiviso: true});
                this.props.getUsersAction()
                .then(()=>{
                    this.countScoreShare();                
                });            
            })
        } else {
            console.log('Non fare nulla');
        }
    }

    animationCircuitoMappa = () => {
        var path = anime.path('.Circuito polyline');
        var ping = anime({
            targets: '.square',
            translateX: path('x'),
            translateY: path('y'),
            //rotate: path('angle'),
            delay: 200,
            easing: 'easeOutExpo',
            duration: 5000,
            loop: false,
            autoplay: false,
            elasticity: 500
        });
        ping.seek((this.state.dashboard.kmPerc / 100) * ping.duration);
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
        const { dashboard, nextStepDisplay } = this.state;
        const { redirect } = this.state;

        if (!sessionStorage.getItem('userData') || redirect) {
            return (<Redirect to={'/'} />)
        }       

        if (this.props.orientation == 'portrait' && this.props.isMobile) {
            return (<LoadingRotation />)
        }

        const userData = JSON.parse(sessionStorage.getItem('userData'));
        this.animationDataDashboard();

        return (            
            <div>
                <h1>Grazie {userData.name}!</h1>
                <img alt="profilo" src={userData.provider_pic} width="35"/>
                <br />
                <br />
                Km: <span ref={this.kmRef}>{dashboard.km}</span>
                <br />
                Cal: <span ref={this.calRef}>{dashboard.cal}</span>
                <br />
                Km: <span ref={this.perKmRef}>{dashboard.kmPerc}%</span>
                <br />
                Energie: <span ref={this.perCalRef}>{dashboard.calPerc}%</span>
                <br />
                <Share share={this.shareHandler}/>
                <div className="NextStep">
                    <ProgressBar percentage={dashboard.kmPerc} kmPercorsi={dashboard.km} kmMancanti={dashboard.kmMancanti} />
                    Mancano: <span>{nextStepDisplay.dif}</span> calorie per arrivare in <span>{nextStepDisplay.continente}</span>
                </div>
                <div className="Circuito">
                    <div className="inner">
                        <Mappa className="Mappa"/>
                        <Percorso className="Percorso"/>
                        <div className="square"><PinBabbo /></div>
                    </div>
                </div>
            </div>
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
    })(Home);