import { readFileSync } from 'fs'
import { runInlineTest } from 'jscodeshift/src/testUtils'
import { join } from 'path'
import { IRuntimeOptions } from './types'

const runTest = (
  dirName: string,
  transformName: string,
  options?: IRuntimeOptions,
  testFilePrefix?: string
): void => {
  if (!testFilePrefix) {
    testFilePrefix = transformName
  }

  const fixtureDir: string = join(
    dirName,
    '..',
    '__testfixtures__',
    transformName
  )
  const inputPath: string = join(
    fixtureDir,
    'index.input.js'
  )
  const source: string = readFileSync(inputPath, 'utf8')
  const expectedOutput: string = readFileSync(
    join(fixtureDir, 'index.output.js'),
    'utf8'
  )

  // Assumes transform is one level up from __tests__ directory
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const module: NodeModule = require(join(
    dirName,
    '..',
    'index.ts'
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

const simpleTest = (transformName: string): void =>
  runTest(__dirname, transformName)

const defineTest = (
  dirName: string,
  transformName: string,
  options?: IRuntimeOptions,
  testFilePrefix?: string
): void => {
  const testName = testFilePrefix
    ? `transforms correctly using "${testFilePrefix}" data`
    : 'transforms correctly'
  describe(
    transformName,
    (): void => {
      it(
        testName,
        (): void => {
          runTest(
            dirName,
            transformName,
            options,
            testFilePrefix
          )
        }
      )
    }
  )
}

export { defineTest, runTest, simpleTest }
