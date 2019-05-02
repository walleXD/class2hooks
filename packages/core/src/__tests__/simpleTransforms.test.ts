import { simpleTest } from 'lib/testRunners'

describe('transforms correctly', (): void => {
  it('pure', (): void => simpleTest('withRender'))

  it('withMethod', (): void => simpleTest('withMethod'))
})
