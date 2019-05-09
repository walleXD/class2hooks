declare module 'jscodeshift/src/testUtils' {
  export function runInlineTest(
    module: NodeModule,
    options: any | null,
    input: {
      path: string
      source: string
    },
    expectedOutput: string
  ): void
}
