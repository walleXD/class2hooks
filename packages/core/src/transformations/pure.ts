import {
  arrowFunctionExpression,
  ASTNode,
  blockStatement,
  identifier,
  returnStatement,
  variableDeclaration,
  variableDeclarator,
  VariableDeclaration,
  ASTPath,
  ClassDeclaration,
  callExpression,
  arrayPattern
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
      (
        p: ASTPath<ClassDeclaration>
      ): VariableDeclaration => {
        const name = getClassName(p)
        if (!name) throw new Error('Something broke')

        const constructorMethod = p.value.body.body.filter(
          isConstructor
        )[0]

        let constructorBody,
          stateDec: ASTPath,
          states: [ASTNode]

        const stmts: VariableDeclaration[] = []

        // ToDo: extract into a seperate function
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

          states.forEach(
            (node: ASTNode): void => {
              // @ts-ignore
              const name: string = node.key.name
              const newName =
                name.charAt(0).toUpperCase() + name.slice(1)
              // @ts-ignore
              const val = node.value

              stmts.push(
                variableDeclaration('const', [
                  variableDeclarator(
                    arrayPattern([
                      identifier(name),
                      identifier(`update${newName}`)
                    ]),
                    callExpression(identifier('useState'), [
                      val
                    ])
                  )
                ])
              )
            }
          )
        }

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
                ...stmts,
                returnStatement(renderReturn)
              ])
            )
          )
        ]) // replaces class with an arrow function with same name
      }
    )
