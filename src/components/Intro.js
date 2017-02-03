import './Intro.less';
import introStart from '../../assets/start.mp3';
import introBackground from '../../assets/intro.png';
import React, { Component, PropTypes } from 'react';
import Gamepad from 'html5-gamepad';
import { AudioPlayer } from 'react-game-kit-without-gamepad';
import classNames from 'classnames';


const gamepad = new Gamepad();

class Intro extends Component {

  static propTypes = {
    onStart: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      blink: false
    };
  }

  componentDidMount() {
    this.startNoise = new AudioPlayer(introStart);
    window.addEventListener('keypress', this.handleKeyPress);
    this.animationFrame = requestAnimationFrame(this.startUpdate);
    this.interval = setInterval(() => {
      this.setState({
        blink: !this.state.blink
      });
    }, 500);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress);
    cancelAnimationFrame(this.animationFrame);
    window.clearInterval(this.interval);
  }

  startUpdate = () => {
    if (gamepad.button(0, 'left stick')) {
      this.startNoise.play();
      this.props.onStart();
      return;
    }
    this.animationFrame = requestAnimationFrame(this.startUpdate);
  };

  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.startNoise.play();
      this.props.onStart();
    }
  };

  render() {
    const { blink } = this.state;
    const startClasses = classNames('start', { blink });

    return (
      <div className="intro">
        <img src={introBackground} alt="intro-background" />
        <div className={startClasses}>
          Press Enter to Start
        </div>
      </div>
    );
  }
}

export default Intro;
