import React from "react";

//remove-consoles.input.js
export const sum = (a, b) => {
  return a + b;
};

export const multiply = (a, b) => {
  return a * b;
};

export const divide = (a, b) => {
  return a / b;
};

export const average = (a, b) => {
  return divide(sum(a, b), 2);
};

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