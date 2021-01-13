import React, { Component } from 'react';

import {
  Table, Modal,
} from 'antd';
import { connect } from 'react-redux';

import ButtonS from './ButtonS';
import {testFeng} from "./redux/action";

const confirm = (msg, onOk, onCancel) => {
  Modal.confirm({
    title: msg,
    onOk() {
      onOk && onOk();
    },
    onCancel() {
      onCancel && onCancel();
    },
  });
};


@connect(
  state => ({
    data: state.skuunit,
    num: state.skuunit.num,
  }),
  {
    testFeng,
  },
)
class Skuunit extends Component {

    componentDidMount() {
      // eslint-disable-next-line react/prop-types
      this.props.testFeng();
    }

    render() {
      return (
        <div>
          {/* eslint-disable-next-line react/prop-types */}
          <div>{this.props.num}</div>
          <ButtonS />


        </div>
      );
    }
}


export default Skuunit;
