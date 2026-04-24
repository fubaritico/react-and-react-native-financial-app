import { i18nConfig } from '@financial-app/shared/i18n'
import '@financial-app/tokens/css'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import './storybook.css'

void i18n.use(initReactI18next).init(i18nConfig)

const BACKGROUNDS: Record<string, string> = {
  beige: '#f8f4f0',
  white: '#ffffff',
}

interface IStoryContext {
  parameters: { backgrounds?: string }
}

const preview = {
  parameters: {
    layout: 'centered' as const,
  },
  decorators: [
    (Story: () => unknown, context: IStoryContext) => {
      const bg =
        BACKGROUNDS[context.parameters.backgrounds ?? 'beige'] ??
        BACKGROUNDS.beige
      document.body.style.backgroundColor = bg
      return Story()
    },
  ],
}

export default preview
