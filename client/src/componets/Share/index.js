import React, { Component } from 'react';
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    LinkedinIcon,
} from 'react-share';

class Share extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: 'https://greennetworkenergy.it/',
            quote: 'Qui la frase di condivisione',
            hashtag: ['santaneedsyou','secondoHash'],
            via: 'GreenNetworkEnergy',
            hashtagFB: 'santaneedsyou'
        };
    }

    animationSharing = () => {
        this.props.share();
    }

    render() {
        const { url, quote, hashtag, via, hashtagFB } = this.state;
        return(
            <div className="ShareButtons">
                <FacebookShareButton url={url} windowWidth={600} onShareWindowClose={this.animationSharing} quote={quote} hashtag={hashtagFB}>
                    <div className="innerButtonSocial"><FacebookIcon size={32} round={false} borderRadius={15} /> <span>Facebook</span></div>
                </FacebookShareButton>
                <TwitterShareButton url={url} windowWidth={600} onShareWindowClose={this.animationSharing} title={quote} via={via} hashtag={hashtag}>
                    <div className="innerButtonSocial"><TwitterIcon size={32} round={false} borderRadius={15} /> <span>Twitter</span></div>
                </TwitterShareButton>
                <WhatsappShareButton url={url} windowWidth={600} onShareWindowClose={this.animationSharing} title={quote} separator={' '}>
                    <div className="innerButtonSocial"><WhatsappIcon size={32} round={false} borderRadius={15} /> <span>WhatsApp</span></div>
                </WhatsappShareButton>
                <LinkedinShareButton url={url} windowWidth={600} onShareWindowClose={this.animationSharing}>
                    <div className="innerButtonSocial"><LinkedinIcon size={32} round={false} borderRadius={15} /> <span>LinkedIn</span></div>
                </LinkedinShareButton>
            </div>
        )
    }
}

export default Share;
