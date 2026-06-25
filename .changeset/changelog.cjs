'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

const github = require('@changesets/changelog-github')

const base = github.default || github

const BULLET_RE = /^- (\[#\d+\]\([^)]*\) )?(\[`[0-9a-f]{7,40}`\]\([^)]*\) )?(?:Thanks (\[@[^\]]+\]\([^)]*\))! )?- ([\s\S]*)$/

function reformat(line) {
  const m = line.match(BULLET_RE)
  if (!m) return line
  const pr = m[1] ? m[1].trim() : null
  const commit = m[2] ? m[2].trim() : null
  const user = m[3] || null
  const desc = m[4]
  const where = pr && commit ? `${pr} (${commit})` : (pr || commit)
  let suffix = ''
  if (user && where) suffix = ` by ${user} in ${where}`
  else if (user) suffix = ` by ${user}`
  else if (where) suffix = ` in ${where}`
  return `- ${desc}${suffix}`
}

exports.default = {
  getDependencyReleaseLine: base.getDependencyReleaseLine,
  getReleaseLine: async (changeset, type, options) => {
    const text = await base.getReleaseLine(changeset, type, options)
    const lines = text.split('\n')
    const idx = lines.findIndex(line => line.startsWith('- '))
    if (idx !== -1) lines[idx] = reformat(lines[idx])
    return lines.join('\n')
  },
}
