import React, { PureComponent } from 'react';

class OurComponent extends PureComponent {
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
