import gameMusic from '../../assets/game-music.mp3';
import powerModeSound from '../../assets/powerup.mp3';
import React, { Component, PropTypes } from 'react';
import Matter from 'matter-js';
import { WORLD_WIDTH, COLLISIONS } from '../constants/Constants';

import { Loop, Stage, World, KeyListener, AudioPlayer } from 'react-game-kit-without-gamepad';

import Level from './Level';
import Character from './Character';
import Evils from './Evils';
import Power from './Power';
import Fade from './Fade';
import Score from './Score';
import PowerModeLabel from './PowerModeLabel';
import Timer from './Timer';

import { createStore } from '../stores/game-store';
let GameStore = createStore();


class Game extends Component {

  static propTypes = {
    onGameOver: PropTypes.func
  };

  constructor(props) {
    super(props);
    GameStore = createStore();

    this.state = { fade: true, powerModeTaken: false };

    this.keyListener = new KeyListener();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.context = window.context || new AudioContext();
  }

  componentDidMount() {
    this.player = new AudioPlayer(gameMusic, () => {
      this.stopMusic = this.player.play({ loop: true, offset: 1, volume: 0.25 });
    });

    this.powerModeNoise = new AudioPlayer(powerModeSound);

    this.setState({ fade: false });

    this.keyListener.subscribe([
      this.keyListener.LEFT,
      this.keyListener.RIGHT,
      this.keyListener.UP,
      this.keyListener.SPACE,
      65
    ]);
  }

  componentWillUnmount() {
    this.stopMusic();
    this.keyListener.unsubscribe();
  }

  onCollision = (a) => {
    for (let i = 0; i < a.source.pairs.list.length; i++) {
      const catA = a.source.pairs.list[i].bodyA.collisionFilter.category;
      const catB = a.source.pairs.list[i].bodyB.collisionFilter.category;
      if (catA === COLLISIONS.character && catB === COLLISIONS.evil ||
          catA === COLLISIONS.evil && catB === COLLISIONS.character) {
        this.handleGameOver();
      } else if (catA === COLLISIONS.character && catB === COLLISIONS.power ||
          catA === COLLISIONS.power && catB === COLLISIONS.character) {
        this.handlePowerMode();
      }
    }
  };

  physicsInit = (engine) => {
    const ground = Matter.Bodies.rectangle(
      512 * 3, 448,
      WORLD_WIDTH * 2, 64,
      {
        isStatic: true,
        collisionFilter: {
          category: COLLISIONS.ground,
          mask: COLLISIONS.evil | COLLISIONS.character,
          group: 6
        }
      }
    );

    const leftWall = Matter.Bodies.rectangle(
      -64, 288,
      64, 576,
      {
        isStatic: true,
        collisionFilter: {
          category: COLLISIONS.wall,
          mask: COLLISIONS.character,
          group: 5
        }
      }
    );

    const rightWall = Matter.Bodies.rectangle(
      WORLD_WIDTH + 230, 288,
      64, 576,
      {
        isStatic: true,
        collisionFilter: {
          category: COLLISIONS.wall,
          mask: COLLISIONS.character,
          group: 5
        }
      }
    );

    Matter.World.addBody(engine.world, ground);
    Matter.World.addBody(engine.world, leftWall);
    Matter.World.addBody(engine.world, rightWall);
  };

  handleGameOver = () => {
    this.setState({ fade: true });
    this.props.onGameOver(GameStore.score);
  };

  handlePowerMode = () => {
    if (!GameStore.power.hit) {
      this.powerModeNoise.play({ volume: 0.25 });
      GameStore.setPowerMode();
      this.setState({ powerModeTaken: true });
    }
  };

  render() {
    const { fade, powerModeTaken } = this.state;

    return (
      <Loop>
        <Stage style={{ background: '#2e3235', position: 'static' }}>
          <World onInit={this.physicsInit} onCollision={this.onCollision}>
            <Score store={GameStore} />
            <PowerModeLabel store={GameStore} />
            <Timer seconds={60} onGameOver={this.handleGameOver} />
            <Level store={GameStore} />
            <Character
              store={GameStore}
              keys={this.keyListener}
            />
            {!powerModeTaken && <Power store={GameStore} />}
            <Evils store={GameStore} />
          </World>
        </Stage>
        <Fade visible={fade} />
      </Loop>
    );
  }
}

export default Game;
