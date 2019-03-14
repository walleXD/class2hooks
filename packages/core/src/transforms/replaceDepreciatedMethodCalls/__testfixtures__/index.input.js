import React, { Component } from "react";
import g from 'geometry';
import otherModule from 'otherModule';

console.log("wtf?!");

const radius = 20;
const area = g.circleArea(radius);
console.log(area === Math.pow(g.getPi(), 2) * radius);
console.log(area === otherModule.circleArea(radius));