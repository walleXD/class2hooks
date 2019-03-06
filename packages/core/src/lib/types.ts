import { Options } from "jscodeshift"
export interface RuntimeOptions extends Options {
  refactorState: boolean
}
