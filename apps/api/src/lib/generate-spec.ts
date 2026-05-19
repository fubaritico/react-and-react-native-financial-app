import fs from 'node:fs'
import path from 'node:path'

import yaml from 'yaml'

import { generateDocument } from './openapi.js'

// Dynamically import all route files to trigger registry.registerPath() calls.
// Avoids maintaining a manual list that falls out of sync when new routes are added.
const routesDir = path.resolve(import.meta.dirname, '../routes')
const routeFiles = fs.readdirSync(routesDir).filter((f) => f.endsWith('.ts'))
await Promise.all(
  routeFiles.map((f) => import(`../routes/${f.replace('.ts', '.js')}`))
)

const spec = generateDocument()
const outPath = path.resolve(import.meta.dirname, '../../openapi.yaml')
fs.writeFileSync(outPath, yaml.stringify(spec))
console.error(`OpenAPI spec written to ${outPath}`)
