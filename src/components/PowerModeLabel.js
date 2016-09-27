import './PowerModeLabel.less';
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';


@observer
class PowerModeLabel extends Component {

  static propTypes = {
    store: PropTypes.object
  };

  render() {
    const { power } = this.props.store;

    if (!power.hit) {
      return null;
    }

    return (
      <div className="power-mode-label">
        DBot mode! ends in: {power.secondsLeft} seconds
      </div>
    );
  }
}

export default PowerModeLabel;
