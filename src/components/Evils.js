import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Evil from './Evil';


@observer
class Evils extends Component {

  static propTypes = {
    store: PropTypes.object
  };

  render() {
    const { store } = this.props;
    const { evils } = store;

    return (
      <span>
        {Object.keys(evils).map(id => <Evil key={id} id={id} store={store} />)}
      </span>
    );
  }
}

export default Evils;
