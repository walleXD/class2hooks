import { NodePath } from 'ast-types'
import j, {
  ASTNode,
  ClassDeclaration,
  ImportDeclaration,
  ImportSpecifier,
  MethodDefinition
} from 'jscodeshift'
import { Collection } from 'jscodeshift/src/Collection'

/**
 * findModule
 * @param {Collection<ASTNode>} path
 * @param {string} module
 */
const findModule = (
  path: Collection<ASTNode>,
  module: string
): Collection<ImportDeclaration> | Collection<void> =>
  path
    .find(ImportDeclaration, {
      source: {
        type: 'Literal'
      },
      type: 'ImportDeclaration'
    })
    .filter(
      (declarator): boolean =>
        declarator.value.source.value === module
    )

/**
 * Checks if the file imports a certain module
 * @param {Collection<ASTNode>} path
 * @param {string} module
 */
const hasModule = (
  path: Collection<ASTNode>,
  module: string
): boolean => findModule(path, module).size() === 1

/**
 * Checks if a node is a render method
 * @param {Collection<ASTNode>} node
 */
const isRenderMethod = (node: ASTNode): boolean =>
  node.type === 'MethodDefinition' &&
  node.key.type === 'Identifier' &&
  node.key.name === 'render'

/**
 * Checks if the file imports a React module
 * @param {Collection<ASTNode>} path
 */
const hasReact = (path: Collection<ASTNode>): boolean =>
  hasModule(path, 'React') ||
  hasModule(path, 'react') ||
  hasModule(path, 'react-native')

/**
 * Checks to see if class component has only render method
 * @param {Collection<ASTNode>} path
 */
const hasOnlyRenderMethod = (path: NodePath): boolean =>
  j(path)
    .find(MethodDefinition)
    .filter((p): boolean => !isRenderMethod(p.value))
    .size() === 0

/**
 * Finds alias for React.Component if used as named import.
 * @param {Collection<ASTNode>} path
 * @param {string} parentClassName
 */
const findReactComponentNameByParent = (
  path: Collection<ASTNode>,
  parentClassName: string
): string | undefined => {
  const reactImportDeclaration = path
    .find(ImportDeclaration, {
      source: {
        type: 'Literal'
      },
      type: 'ImportDeclaration'
    })
    .filter((): boolean => hasReact(path))

  const componentImportSpecifier = reactImportDeclaration
    .find(ImportSpecifier, {
      imported: {
        name: parentClassName,
        type: 'Identifier'
      },
      type: 'ImportSpecifier'
    })
    .at(0)

  const paths = componentImportSpecifier.paths()
  return paths.length
    ? paths[0].value.local.name
    : undefined
}

/**
 * Finds the class declaration node within a given collection of ASTNode
 * @param {Collection<ASTNode>} path
 * @param {string} parentClassName
 */
const findReactES6ClassDeclarationByParent = (
  path: Collection<ASTNode>,
  parentClassName: string
): Collection<ClassDeclaration> => {
  const componentImport = findReactComponentNameByParent(
    path,
    parentClassName
  )

  const selector = componentImport
    ? {
        superClass: {
          name: componentImport,
          type: 'Identifier'
        }
      }
    : {
        superClass: {
          object: {
            name: 'React',
            type: 'Identifier'
          },
          property: {
            name: 'Component',
            type: 'Identifier'
          },
          type: 'MemberExpression'
        }
      }

  return path.find(ClassDeclaration, selector)
}

/**
 * Finds all classes that extend React.Component
 * @param {Collection<ASTNode>} path
 */
const findReactES6ClassDeclaration = (
  path: Collection<ASTNode>
): Collection<ClassDeclaration> => {
  let classDeclarations = findReactES6ClassDeclarationByParent(
    path,
    'Component'
  )
  if (classDeclarations.size() === 0) {
    classDeclarations = findReactES6ClassDeclarationByParent(
      path,
      'PureComponent'
    )
  }
  return classDeclarations
}

/**
 * Checks if the file has React ES6 Class Components
 * @param {Collection<ASTNode>} path
 */
const hasReactES6Class = (
  path: Collection<ASTNode>
): boolean => findReactES6ClassDeclaration(path).size() > 0

/**
 * Finds JSX in file
 * @param {Collection<ASTNode>} path
 */
const findJSX = (
  path: Collection<ASTNode>
): Collection<ASTNode> => path.findJSXElements()

/**
 * Checks if the file has JSX
 * @param {Collection<ASTNode>} path
 */
const hasJSX = (path: Collection<ASTNode>): boolean =>
  findJSX(path).size() > 0

/**
 * Filter our path down to a collection of AST nodes that ONLY contains items in the following form:
 * ClassBody -> MethodDefinition -> Value -> Key -> KeyName : [fnName]. If [fnName] === untransformable, then we add it to our modified path collection.
 * @param {Collection<ASTNode>} path
 */
const findComponentDidCatchMethod = (
  path: Collection<ASTNode>
): Collection<ASTNode> =>
  path
    .find(MethodDefinition)
    .filter(
      (p: NodePath): boolean =>
        p.value.key.name === 'componentDidCatch'
    )

// ---------------------------------------------------------------------------
// Checks if the file has findComponentDidCatch Method. If our path has 1 or more componentDidCatchMethods, return true
const hasComponentDidCatchMethod = (
  path: Collection<ASTNode>
): boolean => findComponentDidCatchMethod(path).size() > 0

/**
 * Filter our path down to a collection of AST nodes that ONLY contains items in the following form:
 * ClassBody -> MethodDefinition -> Value -> Key -> KeyName : [fnName]. If [fnName] === untransformable, then we add it to our modified path collection.
 * @param {Collection<ASTNode>} path
 */
const findGetDerivedStateFromErrorMethod = (
  path: Collection<ASTNode>
): Collection<ASTNode> =>
  path
    .find(MethodDefinition)
    .filter(
      (p: NodePath): boolean =>
        p.value.key.name === 'getDerivedStateFromError'
    )

/**
 * Checks if the file has findGetDerivedStateFromError Method.
 * If our path has 'getDerivedStateFromError's, return true
 * @param {Collection<ASTNode>} path
 */
const hasGetDerivedStateFromErrorMethod = (
  path: Collection<ASTNode>
): boolean =>
  findGetDerivedStateFromErrorMethod(path).size() > 0

const isConstructor = (node: ASTNode): boolean =>
  node.type === 'MethodDefinition' &&
  node.key.type === 'Identifier' &&
  node.key.name === 'constructor'

const findConstructor = (
  path: Collection<ASTNode>
): Collection<ASTNode> =>
  path
    .find(MethodDefinition)
    .filter((p): boolean => isConstructor(p.value))

const hasConstructor = (
  path: Collection<ASTNode>
): boolean => findConstructor(path).size() === 1

const findAssignmentExpressions = (
  path: Collection<ASTNode>
): Collection<ASTNode> => {
  return path
}

const findStateInit = (
  path: Collection<ASTNode>
): Collection<ASTNode> => {
  return path
}

/**
 * Get the name of a Class
 * @param {Collection<ASTNode>} path
 */
const getClassName = (
  path: NodePath<ClassDeclaration, ClassDeclaration>
): string => path.node.id.name

/**
 * Bails out of transformation
 * @param {Collection<ASTNode>} path - Node with error
 * @param {string} msg - Error message
 */
const skipTransformation = (
  path: Collection<ASTNode>,
  msg: string
): void =>
  // TODO: Add better error reporting
  console.warn(msg)

export {
  hasModule,
  hasReact,
  hasReactES6Class,
  hasJSX,
  hasComponentDidCatchMethod,
  hasGetDerivedStateFromErrorMethod,
  hasOnlyRenderMethod,
  hasConstructor,
  findReactComponentNameByParent,
  findReactES6ClassDeclaration,
  findReactES6ClassDeclarationByParent,
  findJSX,
  findComponentDidCatchMethod,
  findGetDerivedStateFromErrorMethod,
  findModule,
  findConstructor,
  getClassName,
  isRenderMethod,
  skipTransformation
}
