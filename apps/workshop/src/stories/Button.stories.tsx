import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@movie/ui';

const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0f172a',
        },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'The button label.',
      control: 'text',
    },
    variant: {
      description: 'The type of button to display.',
      control: 'radio',
      options: ['primary', 'secondary', 'standalone'],
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    disabled: {
      description: 'Is the button disabled?',
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
      },
    },
    'data-testid': {
      description: 'The test id of the button component.',
      control: 'none',
      table: {
        defaultValue: { summary: 'button' },
      },
    },
    onClick: {
      description: 'The onclick event handler of the button component.',
      control: 'none',
    },
  },
  args: {
    label: 'Submit',
    variant: 'primary',
    disabled: false,
    'data-testid': 'button',
    onClick: () => console.log('hello world'),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Standalone: Story = {
  args: {
    variant: 'standalone',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
