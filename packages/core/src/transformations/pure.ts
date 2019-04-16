import {
  arrowFunctionExpression,
  ASTNode,
  blockStatement,
  identifier,
  returnStatement,
  variableDeclaration,
  variableDeclarator,
  VariableDeclaration
} from 'jscodeshift'
import { Collection } from 'jscodeshift/src/Collection'
import {
  findReactES6ClassDeclaration,
  getClassName,
  hasOnlyRenderMethod,
  isRenderMethod
} from 'lib/utils'

export default (
  path: Collection<ASTNode>
): Collection<VariableDeclaration> =>
  findReactES6ClassDeclaration(path) // collection of classes
    .filter((p): boolean => hasOnlyRenderMethod(p)) // makes sure the classes only have render methods
    .replaceWith(
      (p): VariableDeclaration => {
        const name = getClassName(p)

        const renderMethod = p.value.body.body.filter(
          isRenderMethod
        )[0]
        // @ts-ignore
        const renderBody = renderMethod.value.body // TODO: figure out why we are getting type mismatch for renderBody
        const renderReturn = renderBody.body[0].argument

        // TODO: Add ability to make implicit returns on JSX
        return variableDeclaration('const', [
          variableDeclarator(
            identifier(name),
            arrowFunctionExpression(
              [],
              blockStatement([
                returnStatement(renderReturn)
              ])
            )
          )
        ]) // replaces class with an arrow function with same name
      }
    )
