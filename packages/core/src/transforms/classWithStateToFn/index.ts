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
export default (file: FileInfo, api: API, options: Options) => {
  const j = api.jscodeshift
  const root: Collection<ASTNode> = j(file.source)

  const defaultOptions: RuntimeOptions = {
    refactorState: false
  }

  const runtimeOptions: RuntimeOptions = { ...defaultOptions, ...options }

  const isTransformable: boolean = runChecks(root, runtimeOptions)

  if (!isTransformable) {
    skipTransformation(root, "Failed initial Check")
    return null
  }

  runTransformation(root)
  removeReactComponentImport(root)

  return root.toSource()
}

const runTransformation = (path: Collection<ASTNode>) => {
  return
}
