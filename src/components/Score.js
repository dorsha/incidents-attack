import './Score.less';
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';


@observer
class Score extends Component {

  static propTypes = {
    store: PropTypes.object
  };

  render() {
    const { score } = this.props.store;

    return (
      <div className="score">
        {score}
      </div>
    );
  }
}

export default Score;
