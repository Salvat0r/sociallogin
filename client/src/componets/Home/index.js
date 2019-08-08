import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUsersAction, updateUserAction, getUserAction, scoreShareAction } from '../../actions';

import Share from '../Share';
import ProgressBar from '../ProgressBar';
import LoadingRotation from '../LoadingRotation';

import anime from 'animejs/lib/anime.es.js';

import { ReactComponent as Percorso } from '../../assets/percorso.svg';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            daskborad: {},
            nextStepDisplay: {},
            redirect: false,
            condiviso: false,
            orientation: ''
        };
        this.dashboardMeasure = this.dashboardMeasure.bind(this);
        this.displayNextStep = this.displayNextStep.bind(this);        
        this.countScoreShare = this.countScoreShare.bind(this); 

        this.kmRef = React.createRef();
        this.calRef = React.createRef();
        this.perKmRef = React.createRef();
        this.perCalRef = React.createRef();
    }

    getOrientation = () => {
        if (window.innerWidth < window.innerHeight) {
            this.setState({ orientation: 'portrait' });
        }
        else {
            this.setState({ orientation: 'landscape' });
        }
    }

    componentDidMount() {

        this.getOrientation();

        window.addEventListener('orientationchange', () => {
            this.getOrientation();
        });

        let data = JSON.parse(sessionStorage.getItem('userData'));

        this.props.getUsersAction()
        .then(()=>{
            this.countScoreShare();                
        });

        if( data && data.provider_id ) {
            this.props.getUserAction(data.provider_id);
        }


        //ANIMAZIONE Percorso
        var path = anime.path('.Circuito path');

        anime.set('.square', {
            translateX: 100,
            translateY: 100,
        });

        var motionPath = anime({
            targets: '.square',
            translateX: path('x'),
            translateY: path('y'),
            rotate: path('angle'),
            delay: 200,
            endDelay: 200,
            easing: 'easeOutExpo',
            duration: 100000,
            loop: false,
            autoplay: false,
        });     


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
                daskborad: {                   
                    ...prevState.daskborad,
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
        let { daskborad } = this.state;
        let calPerc = daskborad.calPerc;
        if (calPerc < 20) {
            let dif = continenti.asia - daskborad.cal;
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
            let dif = continenti.oceania - daskborad.cal;
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
            let dif = continenti.europa - daskborad.cal;
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
            let dif = continenti.africa - daskborad.cal;
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
            let dif = continenti.america - daskborad.cal;
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

    render() {
        const { daskborad, nextStepDisplay } = this.state;
        const { redirect } = this.state;

        if (!sessionStorage.getItem('userData') || redirect) {
            return (<Redirect to={'/'} />)
        }       

        if (this.state.orientation == 'portrait') {
            return (<LoadingRotation />)
        }


        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const kmRef = this.kmRef.current;
        const calRef = this.calRef.current;
        const perKmRef = this.perKmRef.current;
        const perCalRef = this.perCalRef.current;

        if(kmRef && daskborad.km){

            var start = {daskborad: 0};            
            anime({
                targets: start,
                daskborad: daskborad.km,
                round: 1,
                easing: 'linear',
                update: function() {
                    kmRef.innerHTML = JSON.stringify(start.daskborad);
                },
                duration: 1000,
            });
            anime({
                targets: start,
                daskborad: daskborad.cal,
                round: 1,
                easing: 'linear',
                update: function() {
                    calRef.innerHTML = JSON.stringify(start.daskborad);
                },
                duration: 1000,
                delay: 500
            });
            var startPerc = {daskborad: '0%'};  
            anime({
                targets: startPerc,
                daskborad: daskborad.kmPerc,
                round: 10,
                easing: 'linear',
                update: function() {
                    perKmRef.innerHTML = JSON.stringify(startPerc.daskborad);
                },
                duration: 1000,
                delay: 1500
            });
            anime({
                targets: startPerc,
                daskborad: daskborad.calPerc,
                round: 10,
                easing: 'linear',
                update: function() {
                    perCalRef.innerHTML = JSON.stringify(startPerc.daskborad);
                },
                duration: 1000,
                delay: 1800
            });
        }



        return (            
            <div>
                <h1>Grazie {userData.name}!</h1>
                <img alt="profilo" src={userData.provider_pic} width="35"/>
                <br />
                <br />
                Km: <span ref={this.kmRef}>{daskborad.km}</span>
                <br />
                Cal: <span ref={this.calRef}>{daskborad.cal}</span>
                <br />
                Km: <span ref={this.perKmRef}>{daskborad.kmPerc}%</span>
                <br />
                Energie: <span ref={this.perCalRef}>{daskborad.calPerc}%</span>
                <br />
                <Share share={this.shareHandler}/>
                <div className="NextStep">
                    <ProgressBar percentage={daskborad.kmPerc} kmPercorsi={daskborad.km} kmMancanti={daskborad.kmMancanti} />
                    Mancano: <span>{nextStepDisplay.dif}</span> calorie per arrivare in <span>{nextStepDisplay.continente}</span>
                </div>



<div className="Circuito">
    <Percorso />
    <div className="square"></div>
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
        scoreShare: state.scoreShare
    }
}

export default connect(
    mapStateToProps, { 
        getUsersAction, 
        updateUserAction, 
        getUserAction, 
        scoreShareAction 
    })(Home);