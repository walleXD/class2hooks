import { runTest } from 'lib/testRunners'

describe('transforms correctly', (): void => {
  it('pure', (): void => {
    runTest(__dirname, 'pure')
  })

  it('withState', (): void => {
    runTest(__dirname, 'withState')
  })
})
