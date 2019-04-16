import React, { useState } from "react";

const WithMethod = () => {
    
    const testMethod = () => {
        console.log("Hello");
    }
    
    return (
        <div>
            <h1>Hello</h1>
            <button onClick={testMethod}>Test Button</button>
        </div>
    )
}

export default WithMethod