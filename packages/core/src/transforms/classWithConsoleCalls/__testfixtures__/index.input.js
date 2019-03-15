import React, { Component } from "react";

//remove-consoles.input.js
export const sum = (a, b) => { console.log('calling sum with', arguments);
  return a + b;};

export const multiply = (a, b) => { console.warn('calling multiply with', arguments);
  return a * b; };

export const divide = (a, b) => { console.error(`calling divide with ${ arguments }`);
  return a / b; };

export const average = (a, b) => { console.log('calling average with ' + arguments);
  return divide(sum(a, b), 2); };

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