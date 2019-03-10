import { NodePath } from "ast-types"
import { readFileSync } from "fs"
import j, {
  ASTNode,
  ClassDeclaration,
  ImportDeclaration,
  ImportSpecifier,
  MethodDefinition
} from "jscodeshift"
import { Collection } from "jscodeshift/src/Collection"
import { runInlineTest } from "jscodeshift/src/testUtils"
import { join } from "path"
import { RuntimeOptions } from "./types"

const findModule = (
  path: Collection<ASTNode>,
  module: string
): Collection<ImportDeclaration> =>
  path
    .find(ImportDeclaration, {
      source: {
        type: "Literal"
      },
      type: "ImportDeclaration"
    })
    .filter(declarator => declarator.value.source.value === module)

// ---------------------------------------------------------------------------
// Checks if the file imports a certain module
const hasModule = (path: Collection<ASTNode>, module: string) =>
  findModule(path, module).size() === 1

// ---------------------------------------------------------------------------
// Checks if the file imports a React module
const hasReact = (path: Collection<ASTNode>) =>
  hasModule(path, "React") ||
  hasModule(path, "react") ||
  hasModule(path, "react-native")

const hasOnlyRenderMethod = (path: NodePath) =>
  j(path)
    .find(MethodDefinition)
    .filter(p => !isRenderMethod(p.value))
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
        type: "Literal"
      },
      type: "ImportDeclaration"
    })
    .filter(() => hasReact(path))

  const componentImportSpecifier = reactImportDeclaration
    .find(ImportSpecifier, {
      imported: {
        name: parentClassName,
        type: "Identifier"
      },
      type: "ImportSpecifier"
    })
    .at(0)

  const paths = componentImportSpecifier.paths()
  return paths.length ? paths[0].value.local.name : undefined
}

const findReactES6ClassDeclarationByParent = (
  path: Collection<ASTNode>,
  parentClassName: string
): Collection<ClassDeclaration> => {
  const componentImport = findReactComponentNameByParent(path, parentClassName)

  const selector = componentImport
    ? {
        superClass: {
          name: componentImport,
          type: "Identifier"
        }
      }
    : {
        superClass: {
          object: {
            name: "React",
            type: "Identifier"
          },
          property: {
            name: "Component",
            type: "Identifier"
          },
          type: "MemberExpression"
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
const hasReactES6Class = (path: Collection<ASTNode>): boolean =>
  findReactES6ClassDeclaration(path).size() > 0

// ---------------------------------------------------------------------------
// Finds JSX in file
const findJSX = (path: Collection<ASTNode>): Collection<ASTNode> =>
  path.findJSXElements()

// ---------------------------------------------------------------------------
// Checks if the file has JSX
const hasJSX = (path: Collection<ASTNode>): boolean => findJSX(path).size() > 0

// ---------------------------------------------------------------------------
// Filter our path down to a collection of AST nodes that ONLY contains items in the following form:
// ClassBody -> MethodDefinition -> Value -> Key -> KeyName : [fnName]. If [fnName] === untransformable, then we add it to our modified path collection.
const findComponentDidCatchMethod = (
  path: Collection<ASTNode>
): Collection<ASTNode> =>
  path
    .find(MethodDefinition)
    .filter((p: NodePath) => p.value.key.name === "componentDidCatch")

// ---------------------------------------------------------------------------
// Checks if the file has findComponentDidCatch Method. If our path has 1 or more componentDidCatchMethods, return true
const hasComponentDidCatchMethod = (path: Collection<ASTNode>): boolean =>
  findComponentDidCatchMethod(path).size() > 0

// ---------------------------------------------------------------------------
// Filter our path down to a collection of AST nodes that ONLY contains items in the following form:
// ClassBody -> MethodDefinition -> Value -> Key -> KeyName : [fnName]. If [fnName] === untransformable, then we add it to our modified path collection.
const findGetDerivedStateFromErrorMethod = (
  path: Collection<ASTNode>
): Collection<ASTNode> =>
  path
    .find(MethodDefinition)
    .filter((p: NodePath) => p.value.key.name === "getDerivedStateFromError")

// ---------------------------------------------------------------------------
// Checks if the file has findGetDerivedStateFromError Method. If our path has 1 or more 'getDerivedStateFromError's, return true
const hasGetDerivedStateFromErrorMethod = (
  path: Collection<ASTNode>
): boolean => findGetDerivedStateFromErrorMethod(path).size() > 0

// ---------------------------------------------------------------------------
// Get the name of a Class
const getClassName = (
  path: NodePath<ClassDeclaration, ClassDeclaration>
): string => path.node.id.name

// ---------------------------------------------------------------------------
// Checks if a node is a render method
const isRenderMethod = (node: ASTNode) =>
  node.type === "MethodDefinition" &&
  node.key.type === "Identifier" &&
  node.key.name === "render"

// ---------------------------------------------------------------------------
// Bails out of transformation & prints message to console
const skipTransformation = (path: Collection<ASTNode>, msg: string) =>
  // TODO: Add better error reporting
  console.warn(msg)

// ---------------------------------------------------------------------------
// Jest bootstapping fn to run fixtures
const runTest = (
  dirName: string,
  transformName: string,
  options?: RuntimeOptions,
  testFilePrefix?: string
) => {
  if (!testFilePrefix) {
    testFilePrefix = transformName
  }

  const fixtureDir: string = join(
    dirName,
    "..",
    transformName,
    "__testfixtures__"
  )
  const inputPath: string = join(fixtureDir, "index.input.js")
  const source: string = readFileSync(inputPath, "utf8")
  const expectedOutput: string = readFileSync(
    join(fixtureDir, "index.output.js"),
    "utf8"
  )
  // Assumes transform is one level up from __tests__ directory
  const module: NodeModule = require(join(
    dirName,
    "..",
    transformName,
    "index.ts"
  ))

  runInlineTest(
    module,
    options,
    {
      path: inputPath,
      source
    },
    expectedOutput
  )
}

const defineTest = (
  dirName: string,
  transformName: string,
  options?: RuntimeOptions,
  testFilePrefix?: string
) => {
  const testName = testFilePrefix
    ? `transforms correctly using "${testFilePrefix}" data`
    : "transforms correctly"
  describe(transformName, () => {
    it(testName, () => {
      runTest(dirName, transformName, options, testFilePrefix)
    })
  })
}

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
  skipTransformation,
  defineTest
}
