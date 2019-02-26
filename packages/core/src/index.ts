import { API, FileInfo, Options, ASTNode, ASTPath } from "jscodeshift"

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

    return file.source
  } catch (e) {
    api.report(e.message)
  }
}

const isRefactorable = (
  source: String,
  api: API,
  options: RuntimeOptions
): boolean => false

const getRefactorables = (
  source: String,
  api: API,
  options: RuntimeOptions
): ASTPath<ASTNode>[] => []

const runTransforms = (
  transforms: ASTPath<ASTNode>[],
  source: String,
  api: API,
  options: RuntimeOptions
) => {}
