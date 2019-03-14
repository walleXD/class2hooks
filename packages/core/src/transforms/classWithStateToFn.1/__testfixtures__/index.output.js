import React, { PureComponent } from "react";

const PureWithProps = ({test1, test2, test3, ...props}) => {
    return (
        <div>
            <h1>{test1}</h1>
            <h1>{test2}</h1>
            <h1>{test3}</h1>
            <h1>{props.test4}</h1>
        </div>
    )
}

export default PureWithProps