import { API, FileInfo, Options, ASTNode } from "jscodeshift"
import { Collection } from "jscodeshift/src/Collection"

import { RuntimeOptions } from "lib/types"
import runChecks from "lib/runChecks"
import { skipTransformation } from "lib/utils"

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

  const isTransformable: Boolean = runChecks(root, runtimeOptions)

  if (!isTransformable) {
    skipTransformation(root, "Failed initial Check")
    return null
  }

  const transformationSuccess: Boolean = runTransformation(root)

  if (transformationSuccess) return root.toSource()

  skipTransformation(root, "Transformation Failed")
  return null
}

// TODO: refactor return to return object of success / failure w/ message for failure
const runTransformation = (path: Collection<ASTNode>) => {
  return false
}
