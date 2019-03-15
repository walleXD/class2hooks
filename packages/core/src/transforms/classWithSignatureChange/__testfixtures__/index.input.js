import React, { Component } from "react";

//signature-change.input.js
import car from 'car';
const suv = car.factory('white', 'Kia', 'Sorento', 2010, 50000, null, true);
const truck = car.factory('silver', 'Toyota', 'Tacoma', 2006, 100000, true, true);

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

