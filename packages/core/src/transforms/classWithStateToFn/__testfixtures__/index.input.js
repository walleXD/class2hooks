import React, { PureComponent } from "react";

class PureWithProps extends PureComponent {
    render() {
        const { test1, test2, test3 } = this.props;
        return (
            <div>
                <h1>{test1}</h1>
                <h1>{test2}</h1>
                <h1>{test3}</h1>
                <h1>{this.props.test4}</h1>
            </div>
        )
    }
}

export default PureWithProps