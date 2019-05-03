import { Collection } from 'jscodeshift/src/Collection'
import j, { ASTNode } from 'jscodeshift'
import { findConstructor } from '../lib/utils'

export default (
  path: Collection<ASTNode>
): Collection<ASTNode> => {
  // ToDo: handle state initiation
  findConstructor(path)
  // ToDo: handle method binding
  return path
}
