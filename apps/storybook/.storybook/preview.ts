import '@financial-app/tokens/css'
import './storybook.css'

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
