/**
 * Comprova la coherència del conjunt de dades sense cap dependència.
 *
 *   node scripts/valida.mjs
 *
 * Verifica que cada fitxer es diu com el seu slug, que no hi ha slugs
 * repetits, que totes les referències (empreses, categories, tipus de dades,
 * finalitats, fonts, aplicacions) existeixen i que els estats i nivells
 * d'evidència són dels permesos.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const read = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'))
const errors = []
const err = (where, message) => errors.push(`${where}: ${message}`)

const folder = (dir) =>
  readdirSync(join(root, dir))
    .filter((name) => name.endsWith('.json'))
    .map((name) => {
      const item = read(join(dir, name))
      if (`${item.slug}.json` !== name) err(`${dir}/${name}`, `el slug és «${item.slug}»`)
      return item
    })

const set = (items, label) => {
  const seen = new Set()
  for (const { slug } of items) {
    if (seen.has(slug)) err(label, `slug repetit «${slug}»`)
    seen.add(slug)
  }
  return seen
}

const apps = folder('aplicacions')
const companies = folder('empreses')
const sources = folder('fonts')
const incidents = folder('incidents')
const categories = read('taxonomies/categories.json')
const dataTypes = read('taxonomies/tipus-de-dades.json')
const purposes = read('taxonomies/finalitats.json')

const S = {
  aplicacions: set(apps, 'aplicacions'),
  empreses: set(companies, 'empreses'),
  fonts: set(sources, 'fonts'),
  categories: set(categories, 'categories'),
  'tipus de dades': set(dataTypes, 'tipus de dades'),
  finalitats: set(purposes, 'finalitats'),
}
set(incidents, 'incidents')

const ref = (where, kind, slug) => {
  if (slug && !S[kind].has(slug)) err(where, `${kind}: «${slug}» no existeix`)
}
const refs = (where, kind, slugs = []) => slugs.forEach((slug) => ref(where, kind, slug))

const STATUS = ['yes', 'partial', 'no', 'unknown', 'na']
/** Les files de la matriu de dades fan servir una escala pròpia. */
const ROW_STATUS = ['yes', 'optional', 'no', 'unknown']
const LEVEL = ['official', 'regulator', 'independent', 'press', 'editorial', 'unknown']

/** Recorre una fitxa sencera: tota llista `sources` ha d'apuntar a fonts existents i tota afirmació ha de ser vàlida. */
const walk = (where, value, statuses = STATUS) => {
  if (Array.isArray(value)) return value.forEach((item, i) => walk(`${where}[${i}]`, item, statuses))
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value.sources)) refs(where, 'fonts', value.sources)
  if ('status' in value && !statuses.includes(value.status)) err(where, `estat «${value.status}» no vàlid`)
  if ('level' in value && !LEVEL.includes(value.level)) err(where, `nivell «${value.level}» no vàlid`)
  for (const [key, child] of Object.entries(value))
    if (key !== 'sources') walk(`${where}.${key}`, child, key === 'dataCollection' ? ROW_STATUS : statuses)
}

for (const app of apps) {
  const w = `aplicacions/${app.slug}`
  ref(w, 'empreses', app.company)
  if (!app.categories?.length) err(w, 'sense categoria')
  refs(w, 'categories', app.categories)
  for (const row of app.dataCollection ?? []) {
    ref(`${w}.dataCollection`, 'tipus de dades', row.type)
    refs(`${w}.dataCollection[${row.type}]`, 'finalitats', row.purposes)
  }
  for (const period of app.retention?.periods ?? []) ref(`${w}.retention.periods`, 'tipus de dades', period.dataType)
  for (const alternative of app.alternatives ?? []) ref(`${w}.alternatives`, 'aplicacions', alternative.app)
  walk(w, app)
}
for (const company of companies) ref(`empreses/${company.slug}.parent`, 'empreses', company.parent)
for (const incident of incidents) {
  const w = `incidents/${incident.slug}`
  refs(w, 'aplicacions', incident.apps)
  ref(w, 'empreses', incident.company)
  refs(w, 'fonts', incident.sources)
}
for (const category of categories) ref(`categories/${category.slug}.parent`, 'categories', category.parent)

if (errors.length) {
  console.error(errors.join('\n'))
  console.error(`\n${errors.length} errors`)
  process.exit(1)
}
console.log(
  `Dades correctes: ${apps.length} aplicacions, ${companies.length} empreses, ${sources.length} fonts, ${incidents.length} incidents.`,
)
