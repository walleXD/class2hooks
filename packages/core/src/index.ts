import { API, FileInfo, Options } from "jscodeshift"

export default (file: FileInfo, api: API, options: Options) => {
  //   const j = api.jscodeshift
  //   const root = j(file.source)

  return file.source
}
