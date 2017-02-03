import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import Matter from 'matter-js';
import { COLLISIONS } from '../constants/Constants';

import { Body } from 'react-game-kit-without-gamepad';


@observer
class Evil extends Component {

  static propTypes = {
    store: PropTypes.object,
    id: PropTypes.string
  };

  static contextTypes = {
    engine: PropTypes.object,
    scale: PropTypes.number
  };

  componentDidMount() {
    const { body } = this.body;
    const { id, store } = this.props;
    const evil = store.evils[id];
    this.evilInterval = setInterval(() => {
      this.move(body, -evil.speed);
    });
  }

  componentWillUnmount() {
    const evilInterval = this.evilInterval;
    if (evilInterval) {
      window.clearInterval(evilInterval);
    }
  }

  getWrapperStyles() {
    const { id } = this.props;
    const { evils, stageX } = this.props.store;
    const { scale } = this.context;
    const { x, y } = evils[id].position;
    const targetX = x + stageX;

    return {
      position: 'absolute',
      transform: `translate(${targetX * scale}px, ${y * scale}px)`,
      transformOrigin: 'left top',
      color: 'red',
      fontSize: 34
    };
  }

  move = (body, x) => {
    Matter.Body.setVelocity(body, { x, y: 0 });
    this.update();
  };

  update = () => {
    const { store, id } = this.props;
    const { body } = this.body;
    store.setEvilPosition(id, body.position);
  };

  render() {
    const { id, store } = this.props;
    const evil = store.evils[id];
    const { x } = evil.position;

    return (
      <div style={this.getWrapperStyles()}>
        <Body
          args={[x, 384, 64, 64]}
          inertia={Infinity}
          ref={(b) => { this.body = b; }}
          collisionFilter={{ category: COLLISIONS.evil, mask: COLLISIONS.character | COLLISIONS.wall, group: 6 }}
        >
          <div>{evil.name}</div>
        </Body>
      </div>
    );
  }
}

export default Evil;
