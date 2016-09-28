import './css/Index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import GameContainer from './containers/GameContainer';


ReactDOM.render(
  <div>
    <GameContainer />
  </div>,
  document.getElementById('app')
);


export {
  GameContainer
};
