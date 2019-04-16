import { readdirSync, statSync } from "fs"
import { defineTest } from "lib/testRunners"
import { join } from "path"

const dirs = (p: string): string[] =>
  readdirSync(p).filter((f): boolean => statSync(join(p, f)).isDirectory())

dirs(join(__dirname, "..", "__testfixtures__")).map(
  (name): void => defineTest(__dirname, name)
)
