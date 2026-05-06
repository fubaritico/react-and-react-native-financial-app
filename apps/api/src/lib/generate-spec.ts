import fs from 'node:fs'
import path from 'node:path'

import yaml from 'yaml'

// Import all route files to trigger registry.registerPath() calls
import '../routes/balance.js'
import '../routes/transactions.js'
import '../routes/budgets.js'
import '../routes/pots.js'
import '../routes/recurring-bills.js'

import { generateDocument } from './openapi.js'

const spec = generateDocument()
const outPath = path.resolve(import.meta.dirname, '../../openapi.yaml')
fs.writeFileSync(outPath, yaml.stringify(spec))
console.error(`OpenAPI spec written to ${outPath}`)
