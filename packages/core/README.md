# Class2Hooks Core

## `src` Structure

- All transform scrips will be in the `transforms` folder
- Each transform script will be in `index.ts` files. They will be in their own folders named with transform name
- Test setup for each transform will be in `__tests__` folder and their naming scheme will be `[transformName].test.ts`
- Test fixtures will be in `__testfixtures__` folder and all transform associated `input` & `output` files will be in subfolders with names same as transform name
- `input` files will be names `index.input.js` and `output` files will be named `index.output.js`
