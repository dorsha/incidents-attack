import dbot from '../../assets/dbot.png';
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import Matter from 'matter-js';
import { COLLISIONS } from '../constants/Constants';

import { Body } from 'react-game-kit';


@observer
class Power extends Component {

  static propTypes = {
    store: PropTypes.object
  };

  static contextTypes = {
    engine: PropTypes.object,
    scale: PropTypes.number
  };

  componentDidMount() {
    this.setPowerInterval();
  }

  componentWillUnmount() {
    this.clearPowerInterval();
  }

  setPowerInterval() {
    const { body } = this.body;
    this.powerInterval = setInterval(() => {
      if (this.props.store.power.hit) {
        this.clearPowerInterval();
      } else {
        this.move(body, -10);
      }
    });
  }

  getWrapperStyles() {
    const { power, stageX } = this.props.store;
    const { scale } = this.context;
    const { x, y } = power;
    const targetX = x + stageX;

    return {
      position: 'absolute',
      transform: `translate(${targetX * scale}px, ${y * scale}px)`,
      transformOrigin: 'left top',
      color: 'green',
      fontSize: 30
    };
  }

  clearPowerInterval() {
    const powerInterval = this.powerInterval;
    if (powerInterval) {
      window.clearInterval(powerInterval);
    }
  }

  move = (body, x) => {
    Matter.Body.setVelocity(body, { x, y: 0 });
    this.update();
  };

  update = () => {
    const { store } = this.props;
    const { body } = this.body;
    store.setPowerPosition(body.position);
  };

  render() {
    const { power } = this.props.store;

    if (power.hit) {
      return null;
    }

    return (
      <div className="power" style={this.getWrapperStyles()}>
        <Body
          args={[power.x, 384, 30, 30]}
          inertia={Infinity}
          ref={(b) => { this.body = b; }}
          collisionFilter={{ category: COLLISIONS.power, mask: COLLISIONS.character, group: 8 }}
        >
          <img src={dbot} alt="dbot power" width={80} height={80} />
        </Body>
      </div>
    );
  }
}

export default Power;
