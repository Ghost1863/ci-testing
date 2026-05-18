const { readFileSync, writeFileSync, readdirSync } = require('node:fs')
const { join } = require('node:path')

const today = new Date().toISOString().slice(0, 10)
const packagesDir = 'packages'
const headerRe = /^## \d+\.\d+\.\d+\s*$/m

for (const name of readdirSync(packagesDir)) {
  const file = join(packagesDir, name, 'CHANGELOG.md')
  let content
  try {
    content = readFileSync(file, 'utf8')
  } catch {
    continue
  }
  const match = content.match(headerRe)
  if (!match) continue
  const updated = content.replace(headerRe, `${match[0].trim()} - ${today}`)
  if (updated !== content) {
    writeFileSync(file, updated)
    console.log(`stamped ${file}`)
  }
}
