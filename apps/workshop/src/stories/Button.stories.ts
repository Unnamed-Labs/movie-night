import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@movie/ui';

const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me!',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Click me!',
  },
};

export const Standalone: Story = {
  args: {
    variant: 'standalone',
    children: 'Click me!',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Click me!',
  },
};
