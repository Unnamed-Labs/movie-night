import type { Meta, StoryObj } from '@storybook/react';
import { ImageWithText } from '@movie/ui';

const meta = {
  title: 'ImageWithText',
  component: ImageWithText,
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
    src: {
      description: 'The src url of the image.',
      control: 'none',
    },
    text: {
      description: 'The text message below the image.',
      control: 'text',
    },
    'data-testid': {
      description: 'The test id of the image with text component.',
      control: 'none',
      table: {
        defaultValue: { summary: 'image-with-text' },
      },
    },
  },
  args: {
    src: '/waiting-1.jpeg',
    text: 'waiting for suggestions...',
    'data-testid': 'image-with-text',
  },
} satisfies Meta<typeof ImageWithText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
