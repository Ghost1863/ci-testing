import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const today = new Date().toISOString().slice(0, 10)
const packagesDir = 'packages'
const headerRe = /^(## \d+\.\d+\.\d+)\s*$/gm

let modified = false

for (const name of readdirSync(packagesDir)) {
  const file = join(packagesDir, name, 'CHANGELOG.md')
  let content
  try {
    content = readFileSync(file, 'utf8')
  } catch {
    continue
  }
  const updated = content.replace(headerRe, `$1 - ${today}`)
  if (updated !== content) {
    writeFileSync(file, updated)
    modified = true
    console.log(`stamped ${file}`)
  }
}

if (!modified) console.log('no changelog headers to stamp')
