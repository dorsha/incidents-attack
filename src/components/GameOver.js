import './GameOver.less';
import introStart from '../../assets/start.mp3';
import React, { Component, PropTypes } from 'react';
import Gamepad from 'html5-gamepad';
import classNames from 'classnames';

import { AudioPlayer } from 'react-game-kit-without-gamepad';

const gamepad = new Gamepad();

class GameOver extends Component {

  static propTypes = {
    onStart: PropTypes.func,
    score: PropTypes.number
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
    clearInterval(this.interval);
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
    const { score } = this.props;

    const startClasses = classNames('start', { blink });

    return (
      <div className="game-over">
        <div className="game-over-header">
          Game Over
        </div>
        <div className="user-score">
          Your score is: {score}
        </div>
        <div className={startClasses}>
          Press Enter to Start
        </div>
      </div>
    );
  }
}

export default GameOver;
