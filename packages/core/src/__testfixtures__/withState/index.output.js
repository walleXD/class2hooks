import React, { useState } from 'react'

const ClassWithState = () => {
    const [num, updateNum] = useState(0);

    return (
        <div>
            <h1>{this.state.num}</h1>
            <button onClick={() => updateNum(num++)}></button>
        </div>
    );
}
export default ClassWithState
