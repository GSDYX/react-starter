import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Button } from 'antd';
import {testFeng} from "./redux/action";

// eslint-disable-next-line react/prefer-stateless-function
@connect(
  state => ({
    data: state.skuunit,
    num: state.skuunit.num,
  }),
  {
    testFeng,
  },
)
class ButtonS extends Component {
  render() {
    // eslint-disable-next-line react/prop-types

    return (
      <div>
        {/* eslint-disable-next-line react/prop-types */}
        <Button onClick={() => this.props.testFeng(5)}>+++</Button>
      </div>
    );
  }
}

export default ButtonS;
