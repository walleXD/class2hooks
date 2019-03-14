import React, { Component } from "react";

class ClassWithState extends Component {

    constructor(props) {
        super(props);
        this.state = { num: 0};
    }
    testMethod(input = 1) {
        this.setState({ num: this.state += input })
    }
    
    render() {
        return (
            <div>
                <h1>{this.state.num}</h1>
                <button onClick={this.testMethod}>Test Button 1</button>
                <button onClick={() => this.testMethod(2)}>Test Button 2</button>
            </div>
        )
    }
}

export default ClassWithState