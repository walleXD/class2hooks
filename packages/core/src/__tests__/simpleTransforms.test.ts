import { simpleTest } from 'lib/testRunners'

jest.autoMockOff()

describe('transforms correctly', (): void => {
  it('withRender method', (): void =>
    simpleTest('withRender'))

  it('withConstructor method', (): void =>
    simpleTest('withConstructor'))

  // it('withState', (): void => simpleTest('withState'))

  // it('with user methods', (): void =>
  //   simpleTest('withMethod'))

  // it('withComponentDidMount  method', (): void =>
  //   simpleTest('withComponentDidMount'))

  // it('withComponentWillUnmount method', (): void =>
  //   simpleTest('withComponentWillUnmount'))
})
