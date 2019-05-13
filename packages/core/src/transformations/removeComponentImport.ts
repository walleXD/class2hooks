import { Collection } from 'jscodeshift/src/Collection'
import {
  ASTNode,
  ImportDeclaration,
  importDeclaration,
  importDefaultSpecifier,
  identifier,
  literal,
  CallExpression,
  importSpecifier,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  ASTPath
} from 'jscodeshift'

import { findModule } from 'lib/utils'

// ---------------------------------------------------------------------------
// Remove React class component imports
export default (
  path: Collection<ASTNode>
): Collection<ImportDeclaration> | null =>
  findModule(path, 'react').replaceWith(
    (p: ASTPath<ImportDeclaration>): ImportDeclaration => {
      const imports = p.value.specifiers

      const hasUseState: boolean =
        path
          .find(CallExpression, {
            callee: {
              name: 'useState'
            }
          })
          .size() > 0

      const importSpecs: (
        | ImportDefaultSpecifier
        | ImportNamespaceSpecifier
        | ImportSpecifier)[] = [
        importDefaultSpecifier(identifier('React'))
      ]

      if (hasUseState)
        importSpecs.push(
          importSpecifier(identifier('useState'))
        )

      if (imports.length > 1) {
        return importDeclaration(
          importSpecs,
          literal('react')
        )
      } else throw new Error('No imports')
    }
  )
