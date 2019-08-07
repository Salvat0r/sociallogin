import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUsersAction, updateUserAction, getUserAction, scoreShareAction } from '../../actions';
import Share from '../Share';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            daskborad: {},
            nextStepDisplay: {},
            redirect: false,
            condiviso: false
        };
        this.dashboardMeasure = this.dashboardMeasure.bind(this);
        this.displayNextStep = this.displayNextStep.bind(this);        
        this.countScoreShare = this.countScoreShare.bind(this);        
    }

    componentDidMount() {

        let data = JSON.parse(sessionStorage.getItem('userData'));

        this.props.getUsersAction()
        .then(()=>{
            this.countScoreShare();                
        });

        if( data && data.provider_id ) {
            this.props.getUserAction(data.provider_id);
        }
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
        return( 
            this.setState(prevState => ({
                daskborad: {                   
                    ...prevState.daskborad,
                    km: km,
                    kmPerc: kmPerc,
                    cal: cal,
                    calPerc: calPerc  
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

        const userData = JSON.parse(sessionStorage.getItem('userData'));

        return (            
            <div>
                <h1>Grazie {userData.name}!</h1>

                <img alt="profilo" src={userData.provider_pic} width="35"/>
                <br />
                <br />
                Km: {daskborad.km}
                <br />
                Cal: {daskborad.cal}
                <br />
                Km: {daskborad.kmPerc}%
                <br />
                Energie: {daskborad.calPerc}%
                <br />
                Next Step: Mancano: <span>{nextStepDisplay.dif}</span> calorie per arrivare in <span>{nextStepDisplay.continente}</span>
                <br />
                <Share share={this.shareHandler}/>
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