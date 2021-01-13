import React, { Component } from 'react';

import { connect } from 'react-redux';



@connect(
  state => ({
      num:state.two.num,
      statePP:state
  }),
  {

  },
)
class Two extends Component {


    componentDidMount() {

    }

    render() {
      return (
        <div>
            two
          <div>{this.props.num}</div>
        </div>
      );
    }
}


export default Two;
