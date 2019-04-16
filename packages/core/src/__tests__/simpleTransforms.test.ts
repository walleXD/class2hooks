import { simpleTest } from 'lib/testRunners'

describe('transforms correctly', (): void => {
  it('pure', (): void => simpleTest('pure'))

  it('withMethod', (): void => simpleTest('withMethod'))
})
