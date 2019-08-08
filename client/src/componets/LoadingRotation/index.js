import React, {Component} from 'react';
import { ReactComponent as Mobile } from '../../assets/mobile-phone.svg';
import anime from 'animejs/lib/anime.es.js';

class LoadingRotation extends Component {
    constructor(props){
        super(props);
        this.mobilePhone = React.createRef();
    }
    render(){
        if (this.mobilePhone) {
            anime({
                targets: this.mobilePhone.current,
                easing: 'easeInOutQuad',
                loop: true,
                rotate: 90,
                duration: 1000,
                endDelay: 1000,
                scale: ['1','1.5']
            });
        }
        return(
            <div className="LoadingRotation">
                <p>Ruota lo schermo...</p>               
                <span>
                    <Mobile ref={this.mobilePhone} />
                </span>
            </div>
        )
    }
}

export default LoadingRotation;