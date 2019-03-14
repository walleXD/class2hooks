import React, { useState } from "react";

const ClassWithState = () => {

    const [num, updateNum] = useState(0)
    
    const testMethod = (input = 1) => {
        updateNum(num += input)
    }
    
    return (
        <div>
            <h1>{num}</h1>
            <button onClick={testMethod}>Test Button 1</button>
            <button onClick={() => testMethod(2)}>Test Button 2</button>
        </div>
    )
}

export default PureWithProps