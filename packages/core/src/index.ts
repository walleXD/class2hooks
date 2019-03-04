import { API, FileInfo, Options } from "jscodeshift"

import { RuntimeOptions } from "./types"
import runChecks from "./runChecks"

/**
 * Approach
 * =========
 * - Check if the passed source is refactorable, i.e. looks for things we can't refactor
 * - If the the initial check passes, then check for where/what we can refactor
 * - Then run transformations based on the refactorable collections
 */

const runTransformation = (file: FileInfo, api: API, options: Options) => {
  const j = api.jscodeshift
  const root = j(file.source)

  try {
    const defaultOptions: RuntimeOptions = {
      refactorState: false
    }

    const runtimeOptions: RuntimeOptions = { ...defaultOptions, ...options }

    const isTransformable: Boolean = runChecks(root, runtimeOptions)

    console.log(isTransformable)

    if (!isTransformable) throw new Error("Not Transformable 😅")

    return root.toSource()
  } catch (e) {
    api.report(e.message)
  }
}

export default runTransformation
