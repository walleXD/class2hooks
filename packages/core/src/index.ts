import {
    API,
    arrowFunctionExpression,
    ASTNode,
    blockStatement,
    FileInfo,
    identifier,
    Options,
    returnStatement,
    variableDeclaration,
    variableDeclarator
  } from "jscodeshift"
  import { Collection } from "jscodeshift/src/Collection"
  import runChecks from "lib/runChecks"
  import { IRuntimeOptions } from "./lib/types"
  import {
    findReactES6ClassDeclaration,
    getClassName,
    hasOnlyRenderMethod,
    isRenderMethod,
    removeReactComponentImport,
    skipTransformation
  } from "./lib/utils"
  
  /**
   * Pure Class To Functional Component
   * =============================
   * Approach
   * ---------
   * - Check if the passed source is refactorable, i.e. looks for things we can't refactor
   * - If the the initial check passes, then check for where/what we can refactor
   * - Then run transformations based on the refactorable collections
   */
  export default (file: FileInfo, api: API, options: Options) => {
    const j = api.jscodeshift
    const root: Collection<ASTNode> = j(file.source)
  
    const defaultOptions: IRuntimeOptions = {
      refactorState: false
    }
  
    const runtimeOptions: IRuntimeOptions = { ...defaultOptions, ...options }
  
    const isTransformable: boolean = runChecks(root, runtimeOptions)
  
    if (!isTransformable) {
      skipTransformation(root, "Failed initial Check")
      return null
    }
  
    runTransformation(root)
    removeReactComponentImport(root)
  
    return root.toSource()
  }
  
  const runTransformation = (path: Collection<ASTNode>) =>
    findReactES6ClassDeclaration(path) // collection of classes
      .filter(p => hasOnlyRenderMethod(p)) // makes sure the classes only have render methods
      .replaceWith(p => {
        const name = getClassName(p)
  
        const renderMethod = p.value.body.body.filter(isRenderMethod)[0]
        // @ts-ignore
        const renderBody = renderMethod.value.body // TODO: figure out why we are getting type mismatch for renderBody
        const renderReturn = renderBody.body[0].argument
  
        // TODO: Add ability to make implicit returns on JSX
        return variableDeclaration("const", [
          variableDeclarator(
            identifier(name),
            arrowFunctionExpression(
              [],
              blockStatement([returnStatement(renderReturn)])
            )
          )
        ]) // replaces class with an arrow function with same name
      })
  