import { PassThrough } from 'node:stream'

import { createReadableStreamFromReadable } from '@react-router/node'
import { renderToPipeableStream } from 'react-dom/server'
import { ServerRouter } from 'react-router'

import i18n from './i18n'
import { resolveLocale } from './i18n.server'

import type { EntryContext } from 'react-router'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  // Sync i18next language with the client's Accept-Language before rendering
  const locale = resolveLocale(request)
  void i18n.changeLanguage(locale)

  return new Promise<Response>((resolve, reject) => {
    const { pipe } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onShellReady() {
          responseHeaders.set('Content-Type', 'text/html')

          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error instanceof Error ? error : new Error(String(error)))
        },
      }
    )
  })
}
