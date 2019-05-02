import React, { useEffect } from 'react';

const OurComponent = () => {

    useEffect(() => {
        console.log("component unmounted");
    })
    return (
        <h1>Hello</h1>
    );
}
export default OurComponent;
