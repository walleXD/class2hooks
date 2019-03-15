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

// find declaration for "car" import
  const importDeclaration = root.find(j.ImportDeclaration, { source: { type: 'Literal', value: 'car',},});

// get the local name for the imported module
  const localName = importDeclaration.find(j.Identifier).get(0).node.name;

// current order of arguments
  const argKeys = [ 'color', 'make', 'model', 'year', 'miles', 'bedliner', 'alarm', ];

// find where `.factory` is being called
  return root.find(j.CallExpression, { callee: { type: 'MemberExpression', object: { name: localName, }, property: { name: 'factory', },}}).replaceWith(nodePath => {
    const { node } = nodePath;

    // use a builder to create the ObjectExpression
    const argumentsAsObject = j.objectExpression(

      // map the arguments to an Array of Property Nodes
      node.arguments.map((arg, i) => j.property('init', j.identifier(argKeys[i]), j.literal(arg.value))));
    // replace the arguments with our new ObjectExpression
    node.arguments = [argumentsAsObject];

    return node;})
  // specify print options for recast
    .toSource({ quote: 'single', trailingComma: true });
};

