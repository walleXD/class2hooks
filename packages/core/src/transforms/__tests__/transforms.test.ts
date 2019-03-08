import { defineTest } from "lib/utils"
import { readdirSync, statSync } from "fs"
import { join } from "path"

const dirs = (p: string) =>
  readdirSync(p).filter(f => statSync(join(p, f)).isDirectory())

dirs(join(__dirname, ".."))
  .filter(name => name !== "__tests__")
  .map(name => defineTest(__dirname, name))
