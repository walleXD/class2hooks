import {
  ImportDeclaration,
  ASTNode,
  ImportSpecifier,
  ClassDeclaration,
  ASTPath,
  API
} from "jscodeshift"
import { Collection } from "jscodeshift/src/Collection"

// ---------------------------------------------------------------------------
// Checks if the file imports a certain module
const hasModule = (path: Collection<ASTNode>, module: String) =>
  path
    .find(ImportDeclaration, {
      type: "ImportDeclaration",
      source: {
        type: "Literal"
      }
    })
    .filter(declarator => declarator.value.source.value === module)
    .size() === 1

// ---------------------------------------------------------------------------
// Checks if the file imports a React module
const hasReact = (path: Collection<ASTNode>) =>
  hasModule(path, "React") ||
  hasModule(path, "react") ||
  hasModule(path, "react-native")

// ---------------------------------------------------------------------------
// Finds alias for React.Component if used as named import.
const findReactComponentNameByParent = (
  path: Collection<ASTNode>,
  parentClassName: String
): String | undefined => {
  const reactImportDeclaration = path
    .find(ImportDeclaration, {
      type: "ImportDeclaration",
      source: {
        type: "Literal"
      }
    })
    .filter(() => hasReact(path))

  const componentImportSpecifier = reactImportDeclaration
    .find(ImportSpecifier, {
      type: "ImportSpecifier",
      imported: {
        type: "Identifier",
        name: parentClassName
      }
    })
    .at(0)

  const paths = componentImportSpecifier.paths()
  return paths.length ? paths[0].value.local.name : undefined
}

const findReactES6ClassDeclarationByParent = (
  path: Collection<ASTNode>,
  parentClassName: String
): Collection<ClassDeclaration> => {
  const componentImport = findReactComponentNameByParent(path, parentClassName)

  const selector = componentImport
    ? {
        superClass: {
          type: "Identifier",
          name: componentImport
        }
      }
    : {
        superClass: {
          type: "MemberExpression",
          object: {
            type: "Identifier",
            name: "React"
          },
          property: {
            type: "Identifier",
            name: "Component"
          }
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
    "Component"
  )
  if (classDeclarations.size() === 0) {
    classDeclarations = findReactES6ClassDeclarationByParent(
      path,
      "PureComponent"
    )
  }
  return classDeclarations
}

// ---------------------------------------------------------------------------
// Checks if the file has React ES6 Class Components
const hasReactES6Class = (path: Collection<ASTNode>): Boolean =>
  findReactES6ClassDeclaration(path).size() > 0

// ---------------------------------------------------------------------------
// Finds JSX in file
const findJSX = (path: Collection<ASTNode>): Collection<ASTNode> =>
  path.findJSXElements()

// ---------------------------------------------------------------------------
// Checks if the file has JSX
const hasJSX = (path: Collection<ASTNode>): Boolean => findJSX(path).size() > 0

// ---------------------------------------------------------------------------
// ToDo: Find if the React Component has findComponentDidCatch Method
const findComponentDidCatchMethod = (
  path: Collection<ASTNode>
): Collection<ASTNode> => path

// ---------------------------------------------------------------------------
// Checks if the file has findComponentDidCatch Method
const hasComponentDidCatchMethod = (path: Collection<ASTNode>): Boolean => {
  // return findComponentDidCatchMethod(path).size() === 1
  return false
}

// ---------------------------------------------------------------------------
// ToDo: Find if the React Component has findGetDerivedStateFromError Method
const findGetDerivedStateFromErrorMethod = (
  path: Collection<ASTNode>
): Collection<ASTNode> => path

// ---------------------------------------------------------------------------
// Checks if the file has findGetDerivedStateFromError Method
const hasGetDerivedStateFromErrorMethod = (
  path: Collection<ASTNode>
): Boolean => {
  // return findGetDerivedStateFromErrorMethod(path).size() === 1
  return false
}

const skipTransformation = (
  path: Collection<ASTNode>,
  api: API,
  msg: string
) => {
  // TODO: Add better error reporting
  api.report(msg)
}

export {
  hasModule,
  hasReact,
  hasReactES6Class,
  findReactComponentNameByParent,
  findReactES6ClassDeclaration,
  findReactES6ClassDeclarationByParent,
  findJSX,
  hasJSX,
  findComponentDidCatchMethod,
  hasComponentDidCatchMethod,
  findGetDerivedStateFromErrorMethod,
  hasGetDerivedStateFromErrorMethod,
  skipTransformation
}
