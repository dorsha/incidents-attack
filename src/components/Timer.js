import './Timer.less';
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';


@observer
class Timer extends Component {

  static propTypes = {
    onGameOver: PropTypes.func,
    seconds: PropTypes.number
  };

  static defaultProps = {
    seconds: 60
  };

  constructor(props) {
    super(props);
    this.state = { seconds: props.seconds };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.state.seconds === 0) {
        this.props.onGameOver();
      }
      this.setState({ seconds: this.state.seconds - 1 });
    }, 1000);
  }

  componentWillUnmount() {
    const timer = this.timer;
    if (timer) {
      window.clearInterval(timer);
    }
  }

  render() {
    const { seconds } = this.state;

    return (
      <div className="timer">
        {seconds === 0 ? 'Game Over' : 'Seconds left: ' + seconds}
      </div>
    );
  }
}

export default Timer;
