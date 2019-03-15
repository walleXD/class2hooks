import runChecks from "lib/runChecks"
import { RuntimeOptions } from "lib/types"
import { removeReactComponentImport, skipTransformation } from "lib/utils"

/**
 * Pure Class To Functional Component
 * =============================
 * Approach
 * ---------
 * - Check if the passed source is refactorable, i.e. looks for things we can't refactor
 * - If the the initial check passes, then check for where/what we can refactor
 * - Then run transformations based on the refactorable collections
 */
//signature-change.js
export default (fileInfo, api, options) => {

  const j = api.jscodeshift;
  const root = j(fileInfo.source);
/////////////////////////////////////////////////////
  const defaultOptions: RuntimeOptions = {
    refactorState: false
  }

  const runtimeOptions: RuntimeOptions = { ...defaultOptions, ...options }
  const isTransformable: boolean = runChecks(root, runtimeOptions)

// the example file fails this...
  if (!isTransformable) {
    skipTransformation(root, "Failed initial Check")
    return null
  }

  removeReactComponentImport(root)
/////////////////////////////////////////////////////

  const callExpressions = root.find(j.CallExpression, { callee: { type: 'MemberExpression', object: { type: 'Identifier', name: 'console' },},});
  callExpressions.remove();

  return root.toSource();
};