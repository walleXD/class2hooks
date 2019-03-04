import { ASTNode } from "jscodeshift"
import { Collection } from "jscodeshift/src/Collection"

import { RuntimeOptions } from "./types"
import {
  hasReact,
  hasReactES6Class,
  hasJSX,
  hasComponentDidCatchMethod,
  hasGetDerivedStateFromErrorMethod
} from "./checks"

const runChecks = (
  root: Collection<ASTNode>,
  options?: RuntimeOptions
): Boolean =>
  hasReact(root) &&
  hasReactES6Class(root) &&
  hasJSX(root) &&
  !hasComponentDidCatchMethod(root) &&
  !hasGetDerivedStateFromErrorMethod(root)

export default runChecks
