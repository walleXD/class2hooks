# Spec

## Context

React.js is a very popular web framework created & maintained by teams in Facebook. It was the first framework to introduce declerative & functional programming style through _Components_ to the web. Every since then, the core tenants of React.js has permeated all across the web community. Frameworks like Angular & Vue.js take significant inspiration from React.js.

React.js it self has gone through multiple core changes which has significantly improved developed experience & performance. Components were originally created with `createClass` function. From there we had moved to `class` based components. Both of the afformentioned approaches created Components with `state` and `lifecycle` methods. These allowed Components to react to side effects created by the user, network etc. Soon after the React team also introduced _Functional Components_, which are pure functions returning declerative structure of the dom. It allowed developers follow the Container/Component paradigm where Class Components were only used when side effect was necessary while Functional components were to be used every where else.

More recently, the React team introduced `Hooks` API. These are functions which isolate side effects and can be used in Functional Components. React team outlines their motivation [here](https://reactjs.org/docs/hooks-intro.html#motivation).

## Goals

The goal of the project is quite modest. Class2Hooks will take class based components & then create Functional components with hooks while maintaining the same semantics. The users would also be able to pass `jest` test which will run against the new components to ensure that semantics are maintained.

<!-- prettier-ignore -->
    ClassComponent |
                   | --> Class2Hooks --> FuncComponents (w/ or w/o hooks)
        Jest Test  |

## Major Tools

1. [JsCodeShift](https://github.com/facebook/jscodeshift): JS Refactoring framework from FB
2. [Jest](https://www.github.com/facebook/jest): Testing framework
