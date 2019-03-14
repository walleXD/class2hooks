import React, { PureComponent } from "react";

const WithMethod = () => {
    const testMethod = (input = "Test no input") => {
        console.log(`${input} button`)
    }
    
    return (
        <div>
            <button onClick={testMethod}>Test Button</button>
            <button onClick={e => testMethod("Test input")}>Test Button</button>
        </div>
    )
}

export default WithMethod