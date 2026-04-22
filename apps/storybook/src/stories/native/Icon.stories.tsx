import { iconNames } from '@financial-app/icons'
import { Icon, iconSizeMap } from '@financial-app/ui/native'
import { Text, View } from 'react-native'

import type { IIconSize } from '@financial-app/ui/native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const sizeOptions = Object.keys(iconSizeMap) as IIconSize[]

const meta = {
  title: 'Native/Design System/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'select',
      options: [...iconNames],
    },
    iconSize: {
      control: 'select',
      options: [undefined, ...sizeOptions],
    },
    color: { control: 'color' },
    accessibilityLabel: { control: 'text' },
  },
  args: {
    name: 'navOverview',
    iconSize: 'xxl',
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** All icons in a grid with their names. */
export const Showcase: Story = {
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
  render: () => (
    <View style={{ gap: 32 }}>
      {/* All Icons Grid */}
      <View>
        <Text
          style={{
            marginBottom: 16,
            fontSize: 14,
            fontWeight: '600',
            color: '#696868',
          }}
        >
          Available Icons ({iconNames.length})
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          {iconNames.map((name) => (
            <View
              key={name}
              style={{
                alignItems: 'center',
                gap: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: '#e5e5e5',
                borderRadius: 8,
                width: 80,
              }}
            >
              <Icon name={name} iconSize="xxl" />
              <Text
                style={{ fontSize: 11, color: '#696868', textAlign: 'center' }}
              >
                {name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Named Sizes */}
      <View>
        <Text
          style={{
            marginBottom: 16,
            fontSize: 14,
            fontWeight: '600',
            color: '#696868',
          }}
        >
          Named Sizes
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 24 }}>
          {sizeOptions.map((size) => (
            <View key={size} style={{ alignItems: 'center', gap: 8 }}>
              <Icon name="pot" iconSize={size} />
              <Text style={{ fontSize: 11, color: '#696868' }}>
                {size} ({iconSizeMap[size]}px)
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Color Override */}
      <View>
        <Text
          style={{
            marginBottom: 16,
            fontSize: 14,
            fontWeight: '600',
            color: '#696868',
          }}
        >
          Color Override
        </Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Icon name="navBudgets" iconSize="xxl" color="#277C78" />
          <Icon name="navBudgets" iconSize="xxl" color="#F2CDAC" />
          <Icon name="navBudgets" iconSize="xxl" color="#82C9D7" />
          <Icon name="navBudgets" iconSize="xxl" color="#626070" />
          <Icon name="navBudgets" iconSize="xxl" color="#C94736" />
        </View>
      </View>
    </View>
  ),
}
