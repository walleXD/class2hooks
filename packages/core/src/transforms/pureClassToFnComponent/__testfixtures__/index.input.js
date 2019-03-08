import React, { Component } from "react"

class SimpleComponents extends Component {

  // UNCOMMENT THE FOLLOWING AND CHECKS WILL FAIL. 

  // componentDidCatch() {
  //   console.log('cant transform bc of me');
  // }

  // static getDerivedStateFromError(error) {
  //   console.log('cant transform bc of me either');
  // }

  render() {
    return (
      <div>
        <h1>Hello World</h1>
      </div>
    )
  }
}

export default SimpleComponents
