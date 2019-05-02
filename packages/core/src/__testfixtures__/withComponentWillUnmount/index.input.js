import React, { PureComponent } from 'react';

class OurComponent extends PureComponent {
  componentWillUnmount() {
    console.log("component unmounted")
  }

  render() {
    return (
      <h1>Hello</h1>
    );
  }
}

export default OurComponent;
