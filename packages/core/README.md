# Class2Hooks Core

## `src` Structure

- All transform scrips will be in the `transforms` folder
- Each transform script will be in `index.ts` files. They will be in their own folders named with transform name
- Test fixtures will be in `__testfixtures__` folder which will be inside the associated transform folder
- `input` files will be names `index.input.js` and `output` files will be named `index.output.js`

## transformation

| class entities              | lifecycle state  | transform to | successful transform |
| --------------------------- | ---------------- | ------------ | -------------------- |
| render method               | mount / updating | fn return    | done                 |
| constructor method          | mount            | useState     | wip                  |
| componentDidMount method    | mount            | useEffect    | wip                  |
| componentDidUpdate method   | updating         | useEffect    | wip                  |
| componentWillUnmount method | unmount          | useEffect    | wip                  |
| user methods                | n/a              | pure fn      | wip                  |
| class state                 | n/a              | useState     | wip                  |

## dev strategy

1. render method
2. constructor method
3. class state
4. user methods
5. componentDidMount method
6. componentDidUpdate method
7. componentWillUnmount method
