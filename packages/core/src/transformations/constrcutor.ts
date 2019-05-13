import { Collection } from 'jscodeshift/src/Collection'
import { ASTNode } from 'jscodeshift'
import { findConstructor } from '../lib/utils'

export default (
  path: Collection<ASTNode>
): Collection<ASTNode> => {
  // ToDo: handle state initiation
  const cons = findConstructor(path)
  return path
}
