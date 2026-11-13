import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const repoRoot = new URL('..', import.meta.url)
const storiesPath = new URL('../docs/mvp-github-stories.md', import.meta.url)
const apply = process.argv.includes('--apply')
const projectOwner = 'CDERC-Official'
const projectNumber = '5'

const labelColors = {
  'story': '1D76DB',
  'mock-data': '5319E7',
  'account': '0E8A16',
  'products': 'FBCA04',
  'inquiries': 'D93F0B',
  'community': '0052CC'
}

const text = readFileSync(storiesPath, 'utf8')
const stories = []

for (const match of text.matchAll(/^### (S\d+\.\d+) — (.+)$/gm)) {
  const id = match[1]
  const start = match.index + match[0].length
  const rest = text.slice(start)
  const nextHeading = rest.search(/\n## |\n### /)
  let body = (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).trim()
  body = body.replace(/\n---$/, '').trim()

  const labelsLine = body.match(/^\*\*Labels:\*\* (.+)$/m)
  if (!labelsLine) {
    throw new Error(`Missing labels for ${id}`)
  }
  const labels = [...labelsLine[1].matchAll(/`([^`]+)`/g)].map(item => item[1])
  body = body.replace(/^\*\*Labels:\*\* .+\n?/m, '').trim()

  const before = text.slice(0, match.index)
  const epic = [...before.matchAll(/^## Epic: (.+)$/gm)].at(-1)?.[1] ?? 'MVP'
  body = `**Epic:** ${epic}\n\n${body}`

  stories.push({
    id,
    title: `${id} — ${match[2].trim()}`,
    labels,
    body
  })
}

if (stories.length !== 17) {
  throw new Error(`Expected 17 stories, found ${stories.length}`)
}

function gh(args, input) {
  return execFileSync('gh', args, {
    cwd: repoRoot,
    input,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  }).trim()
}

if (!apply) {
  for (const story of stories) {
    console.log(`${story.title}  [${story.labels.join(', ')}]`)
  }
  console.log(`\nDry run only. Issues are added to ${projectOwner} project ${projectNumber}.`)
  console.log('Log in with the project scope, then create them with:')
  console.log('  gh auth login')
  console.log('  gh auth refresh -s project')
  console.log('  node scripts/create-github-stories.mjs --apply')
  process.exit(0)
}

const existingLabels = new Set(
  JSON.parse(gh(['label', 'list', '--limit', '100', '--json', 'name'])).map(label => label.name)
)

for (const [name, color] of Object.entries(labelColors)) {
  if (existingLabels.has(name)) continue
  gh(['label', 'create', name, '--color', color, '--description', 'Sisterhood MVP story'])
  console.log(`Created label ${name}`)
}

const existingIssues = JSON.parse(
  gh(['issue', 'list', '--state', 'all', '--limit', '200', '--json', 'number,title,url'])
)
const existingByTitle = new Map(existingIssues.map(issue => [issue.title, issue]))

const projectItems = JSON.parse(gh([
  'project', 'item-list', projectNumber,
  '--owner', projectOwner,
  '--limit', '500',
  '--format', 'json'
]))
const onProject = new Set(
  (projectItems.items ?? [])
    .map(item => item.content?.url)
    .filter(Boolean)
)

function addToProject(issueUrl) {
  if (onProject.has(issueUrl)) {
    console.log(`Already on project ${projectNumber}: ${issueUrl}`)
    return
  }

  gh([
    'project', 'item-add', projectNumber,
    '--owner', projectOwner,
    '--url', issueUrl
  ])
  onProject.add(issueUrl)
  console.log(`Added to project ${projectNumber}: ${issueUrl}`)
}

for (const story of stories) {
  const existing = existingByTitle.get(story.title)
  const url = existing
    ? existing.url
    : gh([
        'issue', 'create',
        '--title', story.title,
        '--body', story.body,
        ...story.labels.flatMap(label => ['--label', label])
      ])

  if (existing) {
    console.log(`Issue already exists #${existing.number} ${story.title}`)
  } else {
    console.log(url)
  }

  addToProject(url)
}
