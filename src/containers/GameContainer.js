import React, { Component } from 'react';
import { GAME_STATE } from '../constants/Constants';

import { Game, Intro, GameOver } from '../components';


class GameContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gameState: GAME_STATE.intro,
      score: 0
    };
  }

  handleStart = () => {
    this.setState({ gameState: GAME_STATE.start });
  };

  handleGameOver = (score) => {
    this.setState({ gameState: GAME_STATE.gameOver, score });
  };

  render() {
    const { score } = this.state;

    this.gameStates = [
      <Intro onStart={this.handleStart} />,
      <Game onGameOver={this.handleGameOver} />,
      <GameOver onStart={this.handleStart} score={score} />
    ];
    return this.gameStates[this.state.gameState];
  }
}

export default GameContainer;
