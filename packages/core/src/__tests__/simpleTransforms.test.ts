import { simpleTest } from 'lib/testRunners'

describe('transforms correctly', (): void => {
  it('pure', (): void => simpleTest('withRender'))

  it('withMethod', (): void =>
    simpleTest('withConstructor'))

  it('withMethod', (): void => simpleTest('withState'))

  it('withMethod', (): void => simpleTest('withMethod'))

  it('withMethod', (): void =>
    simpleTest('withComponentDidMount'))

  it('withMethod', (): void =>
    simpleTest('withComponentWillUnmount'))
})
