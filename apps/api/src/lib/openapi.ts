import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi'

export const registry = new OpenAPIRegistry()

registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Supabase JWT access token',
})

/** Generates a complete OpenAPI 3.1 document from the registry. */
export function generateDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions)

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Financial App API',
      version: '1.0.0',
      description: 'REST API for the Personal Finance application',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Local development' },
    ],
  })
}
