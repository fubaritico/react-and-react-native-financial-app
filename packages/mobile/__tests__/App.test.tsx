/**
 * @format
 */

import React from 'react'
import ReactTestRenderer from 'react-test-renderer'

import App from '../App'

test('renders correctly', async () => {
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- bare RN CLI ships with react-test-renderer
  await ReactTestRenderer.act(() => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    ReactTestRenderer.create(<App />)
  })
})
