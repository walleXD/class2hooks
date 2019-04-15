import { ASTNode } from "jscodeshift"
import { Collection } from "jscodeshift/src/Collection"

import { IRuntimeOptions } from "./types"
import {
  hasComponentDidCatchMethod,
  hasGetDerivedStateFromErrorMethod,
  hasJSX,
  hasReact,
  hasReactES6Class
} from "./utils"

/**
 * Runs initial checks on file
 * TODO: improve precondition checks
 * TODO: add more transform specific precondition checks
 */
const runChecks = (
  root: Collection<ASTNode>,
  options?: IRuntimeOptions
): boolean =>
  hasReact(root) &&
  hasReactES6Class(root) &&
  hasJSX(root) &&
  !hasComponentDidCatchMethod(root) &&
  !hasGetDerivedStateFromErrorMethod(root)

export default runChecks
