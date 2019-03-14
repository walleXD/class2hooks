import React, { PureComponent } from "react";

class WithMethod extends PureComponent {
    testMethod(input = "Test no input") {
        console.log(`${input} button`)
    }
    
    render() {
        return (
            <div>
                <button onClick={this.testMethod}>Test Button</button>
                <button onClick={e => this.testMethod("Test input")}>Test Button</button>
            </div>
        )
    }
}

export default WithMethod