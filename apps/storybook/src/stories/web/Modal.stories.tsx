import {
  Button,
  Dropdown,
  Modal,
  TextInput,
  Typography,
} from '@financial-app/ui'
import { useState } from 'react'

import type { IDropdownOption, IModalFooterAction } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const budgetCategoryOptions: IDropdownOption[] = [
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'bills', label: 'Bills' },
  { value: 'dining', label: 'Dining Out' },
  { value: 'personal', label: 'Personal Care' },
]

const themeOptions: IDropdownOption[] = [
  { value: 'green', label: 'Green' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'navy', label: 'Navy' },
]

const meta = {
  title: 'Web/Design System/Organisms/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  argTypes: {
    isOpen: { table: { disable: true } },
    onClose: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

// — Add New Budget modal —

const AddBudgetComponent = () => {
  const [open, setOpen] = useState(false)

  const actions: IModalFooterAction[] = [
    {
      label: 'Add Budget',
      variant: 'primary',
      onPress: () => {
        setOpen(false)
      },
    },
  ]

  return (
    <>
      <Button
        title="+ Add New Budget"
        variant="primary"
        onPress={() => {
          setOpen(true)
        }}
      />
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
        accessibilityLabel="Add New Budget"
      >
        <Modal.Header title="Add New Budget" closeLabel="Close" />
        <Modal.Body>
          <Typography variant="body" color="muted" as="p">
            Choose a category to set a spending budget. These categories can
            help you monitor spending.
          </Typography>
          <div
            style={{
              marginTop: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <Dropdown
              label="Budget Category"
              options={budgetCategoryOptions}
              selectedValue="entertainment"
              onSelect={noop}
              accessibilityLabel="Budget category"
              menuAccessibilityLabel="Budget category options"
            />
            <TextInput
              label="Maximum Spend"
              placeholder="e.g. 2000"
              prefix="$"
              value=""
              onChangeText={noop}
            />
            <Dropdown
              label="Theme"
              options={themeOptions}
              selectedValue="green"
              onSelect={noop}
              accessibilityLabel="Theme color"
              menuAccessibilityLabel="Theme color options"
            />
          </div>
        </Modal.Body>
        <Modal.Footer actions={actions} cancelLabel="Cancel" />
      </Modal>
    </>
  )
}

/** Add New Budget — form modal with dropdown, input, and theme picker. */
export const AddBudget: Story = {
  args: { isOpen: false, onClose: noop, children: null },
  render: () => <AddBudgetComponent />,
  parameters: { controls: { disable: true } },
}

// — Delete Confirmation modal —

const DeleteConfirmComponent = () => {
  const [open, setOpen] = useState(false)

  const actions: IModalFooterAction[] = [
    {
      label: 'Yes, Confirm Deletion',
      variant: 'destroy',
      onPress: () => {
        setOpen(false)
      },
    },
  ]

  return (
    <>
      <Button
        title="Delete Budget"
        variant="destroy"
        onPress={() => {
          setOpen(true)
        }}
      />
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
        accessibilityLabel="Delete Entertainment budget"
      >
        <Modal.Header title="Delete 'Entertainment'?" closeLabel="Close" />
        <Modal.Body>
          <Typography variant="body" color="muted" as="p">
            Are you sure you want to delete this budget? This action cannot be
            reversed, and all the data inside it will be removed forever.
          </Typography>
        </Modal.Body>
        <Modal.Footer actions={actions} cancelLabel="No, Go Back" />
      </Modal>
    </>
  )
}

/** Delete confirmation — destroy action + cancel. */
export const DeleteConfirm: Story = {
  args: { isOpen: false, onClose: noop, children: null },
  render: () => <DeleteConfirmComponent />,
  parameters: { controls: { disable: true } },
}

// — Edit Budget modal —

const EditBudgetComponent = () => {
  const [open, setOpen] = useState(false)

  const actions: IModalFooterAction[] = [
    {
      label: 'Save Changes',
      variant: 'primary',
      onPress: () => {
        setOpen(false)
      },
    },
  ]

  return (
    <>
      <Button
        title="Edit Budget"
        variant="secondary"
        onPress={() => {
          setOpen(true)
        }}
      />
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
        accessibilityLabel="Edit Budget"
      >
        <Modal.Header title="Edit Budget" closeLabel="Close" />
        <Modal.Body>
          <Typography variant="body" color="muted" as="p">
            As your budgets change, feel free to update your spending limits.
          </Typography>
          <div
            style={{
              marginTop: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <Dropdown
              label="Budget Category"
              options={budgetCategoryOptions.slice(0, 2)}
              selectedValue="entertainment"
              onSelect={noop}
              accessibilityLabel="Budget category"
              menuAccessibilityLabel="Budget category options"
            />
            <TextInput
              label="Maximum Spend"
              placeholder="e.g. 2000"
              prefix="$"
              value="50.00"
              onChangeText={noop}
            />
            <Dropdown
              label="Theme"
              options={themeOptions.slice(0, 2)}
              selectedValue="green"
              onSelect={noop}
              accessibilityLabel="Theme color"
              menuAccessibilityLabel="Theme color options"
            />
          </div>
        </Modal.Body>
        <Modal.Footer actions={actions} cancelLabel="Cancel" />
      </Modal>
    </>
  )
}

/** Edit Budget — pre-filled form modal. */
export const EditBudget: Story = {
  args: { isOpen: false, onClose: noop, children: null },
  render: () => <EditBudgetComponent />,
  parameters: { controls: { disable: true } },
}

// — Showcase: all 3 side by side —

const ShowcaseComponent = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <AddBudgetComponent />
    <EditBudgetComponent />
    <DeleteConfirmComponent />
  </div>
)

/** All modal variations side by side. */
export const Showcase: Story = {
  args: { isOpen: false, onClose: noop, children: null },
  render: () => <ShowcaseComponent />,
  parameters: { controls: { disable: true } },
}
