import { readdirSync, statSync } from "fs"
import { defineTest } from "lib/testRunners"
import { join } from "path"

const dirs = (p: string) =>
  readdirSync(p).filter(f => statSync(join(p, f)).isDirectory())

dirs(join(__dirname, "..", "__testfixtures__"))
  .map(name => defineTest(__dirname, name))
