import React, { Component } from 'react';

class OurComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state({
      date: new Date()
    })
  }

  render() {
    return (
      <h1>Hello</h1>
    );
  }
}

export default OurComponent;
