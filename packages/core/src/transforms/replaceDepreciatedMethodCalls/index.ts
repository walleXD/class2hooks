import { NodePath } from "ast-types"
import {
  API,
  ASTNode,
  FileInfo,
  Options
} from "jscodeshift"
import { Collection } from "jscodeshift/src/Collection"
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


//deprecated.js
export default (fileInfo, api, options: Options) => {

  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const defaultOptions: RuntimeOptions = {
    refactorState: false
  }

  const runtimeOptions: RuntimeOptions = { ...defaultOptions, ...options }
  const isTransformable: boolean = runChecks(root, runtimeOptions)

// the example file fails this...
 /* if (!isTransformable) {
    skipTransformation(root, "Failed initial Check")
    return null
  }*/

  removeReactComponentImport(root)

  // Removes Component Import - this works!
/*  const importSpecifiers = root.find(j.ImportSpecifier, { imported:
      { type: 'Identifier', name: 'Component'},},);
  importSpecifiers.remove();*/

  // find declaration for "geometry" import
  const importDeclaration = root.find(j.ImportDeclaration,
    { source: { type: 'Literal', value: 'geometry',},});
  // get the local name for the imported module
  const localName =
    // find the Identifiers
    importDeclaration.find(j.Identifier)
    // get the first NodePath from the Collection
      .get(0)
      // get the Node in the NodePath and grab its "name"
      .node.name;

  return root.find(j.MemberExpression, { object: { name: localName,}, property: { name: 'circleArea',},}).replaceWith(nodePath => {
    // get the underlying Node
    const { node } = nodePath;
    // change to our new prop
    node.property.name = 'getCircleArea';
    // replaceWith should return a Node, not a NodePath
    return node;}).toSource(); };


