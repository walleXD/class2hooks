# Class2Hooks (Experimental)

## Refactor React Class Components into Functional components

### Build Status

| branch  | status                                                                                                                     | coverage                                                                                                                                                         |
| ------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| master  | [![Build Status](https://travis-ci.org/walleXD/class2hooks.svg?branch=master)](https://travis-ci.org/walleXD/class2hooks)  | [![Coverage Status](https://coveralls.io/repos/github/walleXD/class2hooks/badge.svg?branch=master)](https://coveralls.io/github/walleXD/class2hooks?branch=dev)  |
| staging | [![Build Status](https://travis-ci.org/walleXD/class2hooks.svg?branch=staging)](https://travis-ci.org/walleXD/class2hooks) | [![Coverage Status](https://coveralls.io/repos/github/walleXD/class2hooks/badge.svg?branch=staging)](https://coveralls.io/github/walleXD/class2hooks?branch=dev) |
| dev     | [![Build Status](https://travis-ci.org/walleXD/class2hooks.svg?branch=dev)](https://travis-ci.org/walleXD/class2hooks)     | [![Coverage Status](https://coveralls.io/repos/github/walleXD/class2hooks/badge.svg?branch=dev)](https://coveralls.io/github/walleXD/class2hooks?branch=dev)     |

### Set up for development

1. Make sure node `10.15.1` is installed in your machine
2. Install `yarn` and `lerna` globally using `npm`

   ```bash
   npm i -g yarn lerna
   ```

3. Install all dependencies

   ```bash
   cd class2hooks
   yarn i
   ```

4. Run Class2Hooks on the sample components to check if everything is running

   ```bash
   cd packages/core
   yarn dev
   ```
