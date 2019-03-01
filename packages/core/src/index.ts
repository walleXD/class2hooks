import { API, FileInfo, Options, ASTNode, ASTPath } from "jscodeshift"
import { isRefactorable } from "./transformation"

interface RuntimeOptions {
  refactorState: boolean
}

/**
 * Approach
 * =========
 * - Check if the passed source is refactorable, i.e. looks for things we can't refactor
 * - If the the initial check passes, then check for where/what we can refactor
 * - Then run transformations based on the refactorable collections
 */
export default (file: FileInfo, api: API, options: Options) => {
  //   const j = api.jscodeshift
  //   const root = j(file.source)

  try {
    const { source } = file

    const defaultOptions: RuntimeOptions = {
      refactorState: false
    }

    const runtimeOptions: RuntimeOptions = { ...defaultOptions, ...options }

    isRefactorable(file, api, runtimeOptions)

    return source

    // return compose(
    //   runTransforms,
    //   getRefactorables,
    //   isRefactorable
    // )({ source, api, options: runtimeOptions })
  } catch (e) {
    api.report(e.message)
  }
}
