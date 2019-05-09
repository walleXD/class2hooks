import { Collection } from 'jscodeshift/src/Collection'
import {
  ASTNode,
  ImportDeclaration,
  importDeclaration,
  importDefaultSpecifier,
  identifier,
  literal
} from 'jscodeshift'
import { NodePath } from 'ast-types'

import { findModule } from 'lib/utils'

// ---------------------------------------------------------------------------
// Remove React class component imports
export default (
  path: Collection<ASTNode>
): Collection<ImportDeclaration> | null =>
  findModule(path, 'react').replaceWith(
    (p: NodePath<ImportDeclaration>): ImportDeclaration => {
      const imports = p.value.specifiers

      if (imports.length > 1) {
        return importDeclaration(
          [importDefaultSpecifier(identifier('React'))],
          literal('react')
        )
      } else throw new Error('No imports')
    }
  )
