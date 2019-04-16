import { NodePath } from 'ast-types'
import j, {
  ASTNode,
  ClassDeclaration,
  ImportDeclaration,
  ImportSpecifier,
  MethodDefinition
} from 'jscodeshift'
import { Collection } from 'jscodeshift/src/Collection'

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

// ---------------------------------------------------------------------------
// Checks if the file imports a certain module
const hasModule = (
  path: Collection<ASTNode>,
  module: string
): boolean => findModule(path, module).size() === 1

// ---------------------------------------------------------------------------
// Checks if a node is a render method
const isRenderMethod = (node: ASTNode): boolean =>
  node.type === 'MethodDefinition' &&
  node.key.type === 'Identifier' &&
  node.key.name === 'render'

// ---------------------------------------------------------------------------
// Checks if the file imports a React module
const hasReact = (path: Collection<ASTNode>): boolean =>
  hasModule(path, 'React') ||
  hasModule(path, 'react') ||
  hasModule(path, 'react-native')

const hasOnlyRenderMethod = (path: NodePath): boolean =>
  j(path)
    .find(MethodDefinition)
    .filter((p): boolean => !isRenderMethod(p.value))
    .size() === 0

// ---------------------------------------------------------------------------
// Finds alias for React.Component if used as named import.
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

// Finds all classes that extend React.Component
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

// ---------------------------------------------------------------------------
// Checks if the file has React ES6 Class Components
const hasReactES6Class = (
  path: Collection<ASTNode>
): boolean => findReactES6ClassDeclaration(path).size() > 0

// ---------------------------------------------------------------------------
// Finds JSX in file
const findJSX = (
  path: Collection<ASTNode>
): Collection<ASTNode> => path.findJSXElements()

// ---------------------------------------------------------------------------
// Checks if the file has JSX
const hasJSX = (path: Collection<ASTNode>): boolean =>
  findJSX(path).size() > 0

// ---------------------------------------------------------------------------
// Filter our path down to a collection of AST nodes that ONLY contains items in the following form:
// ClassBody -> MethodDefinition -> Value -> Key -> KeyName : [fnName]. If [fnName] === untransformable, then we add it to our modified path collection.
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

// ---------------------------------------------------------------------------
// Filter our path down to a collection of AST nodes that ONLY contains items in the following form:
// ClassBody -> MethodDefinition -> Value -> Key -> KeyName : [fnName]. If [fnName] === untransformable, then we add it to our modified path collection.
const findGetDerivedStateFromErrorMethod = (
  path: Collection<ASTNode>
): Collection<ASTNode> =>
  path
    .find(MethodDefinition)
    .filter(
      (p: NodePath): boolean =>
        p.value.key.name === 'getDerivedStateFromError'
    )

// ---------------------------------------------------------------------------
// Checks if the file has findGetDerivedStateFromError Method. If our path has 1 or more 'getDerivedStateFromError's, return true
const hasGetDerivedStateFromErrorMethod = (
  path: Collection<ASTNode>
): boolean =>
  findGetDerivedStateFromErrorMethod(path).size() > 0

// ---------------------------------------------------------------------------
// Get the name of a Class
const getClassName = (
  path: NodePath<ClassDeclaration, ClassDeclaration>
): string => path.node.id.name

// ---------------------------------------------------------------------------
// Bails out of transformation & prints message to console
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
  findReactComponentNameByParent,
  findReactES6ClassDeclaration,
  findReactES6ClassDeclarationByParent,
  findJSX,
  findComponentDidCatchMethod,
  findGetDerivedStateFromErrorMethod,
  findModule,
  getClassName,
  isRenderMethod,
  removeReactComponentImport,
  skipTransformation
}
