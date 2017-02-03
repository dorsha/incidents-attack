import jumpSound from '../../assets/jump.mp3';
import punchSound from '../../assets/punch.mp3';
import characterSprite from '../../assets/character-sprite.png';
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import Gamepad from 'html5-gamepad';
import Matter from 'matter-js';
import { WORLD_WIDTH, COLLISIONS } from '../constants/Constants';

import { AudioPlayer, Body, Sprite } from 'react-game-kit-without-gamepad';


const gamepad = new Gamepad();

@observer
class Character extends Component {

  static propTypes = {
    keys: PropTypes.object,
    store: PropTypes.object
  };

  static contextTypes = {
    engine: PropTypes.object,
    scale: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.loopID = null;
    this.isJumping = false;
    this.isPunching = false;
    this.isLeaving = false;
    this.lastX = 0;

    this.state = {
      characterState: 0,
      loop: false,
      spritePlaying: true
    };
  }

  componentDidMount() {
    this.jumpNoise = new AudioPlayer(jumpSound);
    this.punchNoise = new AudioPlayer(punchSound);
    Matter.Events.on(this.context.engine, 'afterUpdate', this.update);
  }

  componentWillUnmount() {
    Matter.Events.off(this.context.engine, 'afterUpdate', this.update);
  }


  getWrapperStyles() {
    const { characterPosition, stageX } = this.props.store;
    const { scale } = this.context;
    const { x, y } = characterPosition;
    const targetX = x + stageX;

    return {
      position: 'absolute',
      transform: `translate(${targetX * scale}px, ${y * scale}px)`,
      transformOrigin: 'left top'
    };
  }

  handlePlayStateChanged = (state) => {
    this.setState({
      spritePlaying: !!state
    });
  };

  move = (body, x) => {
    Matter.Body.setVelocity(body, { x, y: 0 });
  };

  jump = (body) => {
    const powerMode = this.props.store.power.hit;
    this.jumpNoise.play({ volume: 0.2 });
    this.isJumping = true;
    Matter.Body.applyForce(
        body,
        { x: 0, y: 0 },
        { x: 0, y: powerMode ? -0.25 : -0.17 },
    );
    Matter.Body.set(body, 'friction', 0.0008);
  };

  punch = () => {
    this.punchNoise.play({ volume: 0.1 });
    this.isPunching = true;
    this.setState({
      characterState: 19,
      repeat: false
    });
  };

  checkKeys = (shouldMoveStageLeft, shouldMoveStageRight) => {
    const { keys, store } = this.props;
    const { body } = this.body;

    let characterState = 3;
    let repeat = false;

    if (keys.isDown(65) || gamepad.button(0, 'b')) { // 'a'
      return this.punch();
    }

    if (keys.isDown(keys.SPACE) || gamepad.button(0, 'a')) {
      this.jump(body);
    }

    if (keys.isDown(keys.UP) || gamepad.button(0, 'button 12')) {
      this.jump(body);
    }

    if (keys.isDown(keys.LEFT) || gamepad.button(0, 'button 14')) {
      if (shouldMoveStageLeft) {
        store.setStageX(store.stageX + 5);
      }

      this.move(body, -5);
      characterState = 9;
      repeat = true;
    } else if (keys.isDown(keys.RIGHT) || gamepad.button(0, 'button 15')) {
      if (shouldMoveStageRight) {
        store.setStageX(store.stageX - 5);
      }

      this.move(body, 5);
      characterState = 11;
      repeat = true;
    }

    this.setState({
      characterState,
      repeat
    });

    return null;
  };

  update = () => {
    const { store } = this.props;
    const { body } = this.body;

    const midPoint = Math.abs(store.stageX) + 448;

    const shouldMoveStageLeft = body.position.x < midPoint && store.stageX < 0;
    const shouldMoveStageRight = body.position.x > midPoint && store.stageX > -WORLD_WIDTH;

    const velY = parseFloat(body.velocity.y.toFixed(10));

    if (velY === 0) {
      this.isJumping = false;
      Matter.Body.set(body, 'friction', 0.9999);
    }

    if (!this.isJumping && !this.isPunching && !this.isLeaving) {
      this.checkKeys(shouldMoveStageLeft, shouldMoveStageRight);

      store.setCharacterPosition(body.position);
    } else {
      if (this.isPunching && this.state.spritePlaying === false) {
        this.isPunching = false;
      }

      const targetX = store.stageX + (this.lastX - body.position.x);
      if (shouldMoveStageLeft || shouldMoveStageRight) {
        store.setStageX(targetX + (shouldMoveStageRight ? -2 : 2));
      }
    }

    this.lastX = body.position.x;
  };

  render() {
    const x = this.props.store.characterPosition.x;

    return (
      <div style={this.getWrapperStyles()}>
        <Body
          args={[x, 384, 64, 64]}
          inertia={Infinity}
          ref={(b) => { this.body = b; }}
          collisionFilter={{ category: COLLISIONS.character, mask: COLLISIONS.wall | COLLISIONS.evil, group: 6 }}
        >
          <Sprite
            repeat={this.state.repeat}
            onPlayStateChanged={this.handlePlayStateChanged}
            src={characterSprite}
            scale={this.context.scale * 2}
            state={this.state.characterState}
            steps={[1, 1, 1, 1, 8, 8, 8, 8, 8, 8, 8, 8, 6, 6, 6, 6, 12, 12, 12, 12, 6]}
            tileHeight={64}
            tileWidth={64}
          />
        </Body>
      </div>
    );
  }
}

export default Character;
