import React, { Component } from 'react';
import styled from 'styled-components';
import anime from 'animejs/lib/anime.es.js';

const Thumb = styled.div`
    width: ${props => props.percentage}%;
`;

class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.kmRef = React.createRef();
    }

    clamp = (min, value, max) => {
        return Math.min(Math.max(min, value), max);
    }

    render() {
        const kmRef = this.kmRef.current;
        if(kmRef && this.props.kmPercorsi){
            var start = {daskborad: 0};            
            anime({
                targets: start,
                daskborad: this.props.kmPercorsi,
                round: 1,
                easing: 'linear',
                update: function() {
                    kmRef.innerHTML = JSON.stringify(start.daskborad);
                },
                duration: 1000,
            });
        }
        return (
            <div className="Track">
                <div className="kmMancanti">MANCANO: <span>{this.props.kmMancanti} KM</span></div>
                <Thumb className="Thumb" percentage={this.clamp(1, this.props.percentage, 100)}><div className="kmPercorsi">Km percorsi: <span ref={this.kmRef}>{this.props.kmPercorsi}</span></div></Thumb>
            </div>
        )
    }    
}

export default ProgressBar;