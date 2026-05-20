import { z } from 'zod'

import { registry } from '../lib/openapi.js'

/** Request body for the POST /dev/seed endpoint. */
export const SeedBodySchema = registry.register(
  'SeedBody',
  z.object({
    email: z.string().email().openapi({ example: 'test@dev.com' }),
    password: z
      .string()
      .min(1)
      .max(128)
      .openapi({ example: 'MyStrongP@ssword1' }),
  })
)
