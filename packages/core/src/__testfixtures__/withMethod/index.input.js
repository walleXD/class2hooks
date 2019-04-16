import React, { Component } from "react";

class WithMethod extends Component {
    testMethod() {
        console.log("Hello");
    }
    
    render() {
        return (
            <div>
                <h1>Hello</h1>
                <button onClick={this.testMethod}>Test Button</button>
            </div>
        )
    }
}

export default WithMethod