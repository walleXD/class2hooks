import {
  API,
  ASTNode,
  FileInfo,
  Options
} from 'jscodeshift'
import { Collection } from 'jscodeshift/src/Collection'
import runChecks from 'lib/runChecks'
import { IRuntimeOptions } from './lib/types'
import {
  skipTransformation,
  hasConstructor
} from './lib/utils'

import runTransformation from './transformations/pure'
import removeReactComponentImport from './transformations/removeComponentImport'
import constrcutorTransformation from './transformations/constrcutor'
/**
 * Pure Class To Functional Component
 * =============================
 * Approach
 * ---------
 * - Check if the passed source is refactorable, i.e. looks for things we can't refactor
 * - If the the initial check passes, then check for where/what we can refactor
 * - Then run transformations based on the refactorable collections
 */
export default (
  file: FileInfo,
  api: API,
  options: Options
): string | null => {
  const j = api.jscodeshift
  const root: Collection<ASTNode> = j(file.source)

  const defaultOptions: IRuntimeOptions = {
    refactorState: false
  }

  const runtimeOptions: IRuntimeOptions = {
    ...defaultOptions,
    ...options
  }

  const isTransformable: boolean = runChecks(
    root,
    runtimeOptions
  )

  if (!isTransformable) {
    skipTransformation(root, 'Failed initial Check')
    return null
  }

  if (hasConstructor(root)) constrcutorTransformation(root)

  runTransformation(root)
  removeReactComponentImport(root)

  return root.toSource()
}
