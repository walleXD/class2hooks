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
  isRenderMethod,
  isConstructor,
  isStateDecleration
} from 'lib/utils'

export default (
  path: Collection<ASTNode>
): Collection<VariableDeclaration> =>
  findReactES6ClassDeclaration(path) // collection of classes
    // .filter((p): boolean => hasOnlyRenderMethod(p)) // makes sure the classes only have render methods
    .replaceWith(
      (p): VariableDeclaration => {
        const name = getClassName(p)
        if (!name) throw new Error('Something broke')

        const constructorMethod = p.value.body.body.filter(
          isConstructor
        )[0]

        let constructorBody, stateDec: ASTNode, states
        if (constructorMethod) {
          constructorBody =
            // @ts-ignore
            constructorMethod.value.body.body

          stateDec = constructorBody.filter(
            isStateDecleration
          )[0]

          states =
            // @ts-ignore
            stateDec.expression.arguments[0].properties
        }

        const stateDecStatements = () => {}
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
