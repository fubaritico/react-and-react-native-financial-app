import { iconNames } from '@financial-app/icons'
import { Icon, iconSizeMap } from '@financial-app/ui'
import type { IIconSize } from '@financial-app/ui'
import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const sizeOptions = Object.keys(iconSizeMap) as IIconSize[]

const meta = {
  title: 'Web/Design System/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* All Icons Grid */}
      <section>
        <h3
          style={{
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 600,
            color: '#696868',
          }}
        >
          Available Icons ({iconNames.length})
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 16,
          }}
        >
          {iconNames.map((name) => (
            <div
              key={name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: 12,
                border: '1px solid #e5e5e5',
                borderRadius: 8,
              }}
            >
              <Icon name={name} iconSize="xxl" />
              <span
                style={{ fontSize: 11, color: '#696868', textAlign: 'center' }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Named Sizes */}
      <section>
        <h3
          style={{
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 600,
            color: '#696868',
          }}
        >
          Named Sizes
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
          {sizeOptions.map((size) => (
            <div
              key={size}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Icon name="pot" iconSize={size} />
              <span style={{ fontSize: 11, color: '#696868' }}>
                {size} ({iconSizeMap[size]}px)
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* By Category */}
      <section>
        <h3
          style={{
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 600,
            color: '#696868',
          }}
        >
          By Category
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 11,
                color: '#9e9e9e',
              }}
            >
              Navigation Menu
            </span>
            <div style={{ display: 'flex', gap: 16 }}>
              <Icon name="navOverview" iconSize="xxl" />
              <Icon name="navTransactions" iconSize="xxl" />
              <Icon name="navBudgets" iconSize="xxl" />
              <Icon name="navPots" iconSize="xxl" />
              <Icon name="navRecurringBills" iconSize="xxl" />
            </div>
          </div>
          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 11,
                color: '#9e9e9e',
              }}
            >
              Directional
            </span>
            <div style={{ display: 'flex', gap: 16 }}>
              <Icon name="caretLeft" iconSize="xxl" />
              <Icon name="caretRight" iconSize="xxl" />
              <Icon name="caretDown" iconSize="xxl" />
            </div>
          </div>
          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 11,
                color: '#9e9e9e',
              }}
            >
              Actions
            </span>
            <div style={{ display: 'flex', gap: 16 }}>
              <Icon name="search" iconSize="xxl" />
              <Icon name="filterMobile" iconSize="xxl" />
              <Icon name="sortMobile" iconSize="xxl" />
              <Icon name="ellipsis" iconSize="xxl" />
              <Icon name="closeModal" iconSize="xxl" />
              <Icon name="minimizeMenu" iconSize="xxl" />
            </div>
          </div>
          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 11,
                color: '#9e9e9e',
              }}
            >
              Auth
            </span>
            <div style={{ display: 'flex', gap: 16 }}>
              <Icon name="showPassword" iconSize="xxl" />
              <Icon name="hidePassword" iconSize="xxl" />
            </div>
          </div>
          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 11,
                color: '#9e9e9e',
              }}
            >
              Domain
            </span>
            <div style={{ display: 'flex', gap: 16 }}>
              <Icon name="pot" iconSize="xxl" />
              <Icon name="bill" iconSize="xxl" />
              <Icon name="recurringBills" iconSize="xxl" />
            </div>
          </div>
          <div>
            <span
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 11,
                color: '#9e9e9e',
              }}
            >
              Branding
            </span>
            <div style={{ display: 'flex', gap: 16 }}>
              <Icon name="logoLarge" iconSize="xxl" />
              <Icon name="logoSmall" iconSize="xxl" />
            </div>
          </div>
        </div>
      </section>

      {/* Color Override */}
      <section>
        <h3
          style={{
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 600,
            color: '#696868',
          }}
        >
          Color Override
        </h3>
        <div style={{ display: 'flex', gap: 16 }}>
          <Icon name="navBudgets" iconSize="xxl" color="#277C78" />
          <Icon name="navBudgets" iconSize="xxl" color="#F2CDAC" />
          <Icon name="navBudgets" iconSize="xxl" color="#82C9D7" />
          <Icon name="navBudgets" iconSize="xxl" color="#626070" />
          <Icon name="navBudgets" iconSize="xxl" color="#C94736" />
        </div>
      </section>
    </div>
  ),
}
