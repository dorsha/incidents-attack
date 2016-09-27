/* eslint-disable max-len */
import worldBackground from '../../assets/space-background.jpg';
import walkingArea from '../../assets/floor.gif';
import React, { Component, PropTypes } from 'react';
import { autorun } from 'mobx';

import { TileMap } from 'react-game-kit';


class Level extends Component {

  static propTypes = {
    store: PropTypes.object
  };

  static contextTypes = {
    scale: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = { stageX: 0 };
  }

  componentDidMount() {
    this.cameraWatcher = autorun(() => {
      const targetX = Math.round(this.props.store.stageX * this.context.scale);
      this.setState({
        stageX: targetX
      });
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const targetX = Math.round(this.props.store.stageX * nextContext.scale);
    this.setState({
      stageX: targetX
    });
  }

  componentWillUnmount() {
    this.cameraWatcher();
  }

  getWrapperStyles() {
    return {
      position: 'absolute',
      transform: `translate(${this.state.stageX}px, 0px) translateZ(0)`,
      transformOrigin: 'top left'
    };
  }

  render() {
    return (
      <div style={this.getWrapperStyles()}>
        <TileMap
          style={{ top: Math.floor(64 * this.context.scale) }}
          src={walkingArea}
          tileSize={128}
          columns={50}
          rows={4}
          layers={[
            [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ]
          ]}
        />
        <TileMap
          style={{ top: Math.floor(-63 * this.context.scale) }}
          src={worldBackground}
          rows={1}
          columns={12}
          tileSize={512}
          layers={[
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
          ]}
        />
      </div>
    );
  }
}

export default Level;
