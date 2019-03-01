import { API, FileInfo, Options } from "jscodeshift"

const isRefactorable = (file: FileInfo, api: API, options: Options) => {
  const { source } = file

  const path = api.jscodeshift(source)
  const { j } = api

  const isClass = () => path.find(api.j.ClassDeclaration).size() > 0

  const hasJSX = () => path.findJSXElements().size() > 0

  console.log(source)
  console.log(hasJSX(), isClass(), hasJSX())

  return {
    source,
    api,
    options,
    isRefactorable: false
  }
}

export { isRefactorable }
