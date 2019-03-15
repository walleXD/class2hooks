import React, { Component } from "react";
import g from 'geometry';
import otherModule from 'otherModule';

console.log("OMG what happened?!");

const radius = 20;
const area = g.circleArea(radius);
console.log(area === Math.pow(g.getPi(), 2) * radius);
console.log(area === otherModule.circleArea(radius));

class SimpleComponents extends Component {

  render() {
    return (
      <div>
      <h1>Hello World</h1>
    </div>
  )
  }
}

export default SimpleComponents