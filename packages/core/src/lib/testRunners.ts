import { readFileSync } from "fs";
import { runInlineTest } from "jscodeshift/src/testUtils"
import { join } from "path";
import { IRuntimeOptions } from "./types";

const defineTest = (
  dirName: string,
  transformName: string,
  options?: IRuntimeOptions,
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

const runTest = (
  dirName: string,
  transformName: string,
  options?: IRuntimeOptions,
  testFilePrefix?: string
) => {
  if (!testFilePrefix) {
    testFilePrefix = transformName
  }

  const fixtureDir: string = join(
    dirName,
    "..",
    "__testfixtures__",
    transformName,
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

export { defineTest }