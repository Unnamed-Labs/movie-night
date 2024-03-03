import type { Meta, StoryObj } from '@storybook/react';
import { Error } from '@movie/ui';
import { getImageUrl } from '../utils/getImageUrl';

const meta = {
  title: 'Error',
  component: Error,
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
    images: {
      description: 'The a list of src urls for the error component.',
      control: 'none',
    },
    text: {
      description: 'The error message below the image.',
      control: 'text',
    },
    'data-testid': {
      description: 'The test id of the error component.',
      control: 'none',
      table: {
        defaultValue: { summary: 'error' },
      },
    },
  },
  args: {
    images: [getImageUrl('/error-1.jpeg')],
    text: 'uh oh! we couldn’t create a lobby for you...',
    'data-testid': 'error',
  },
} satisfies Meta<typeof Error>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithCta: Story = {
  args: {
    cta: {
      label: 'try again',
      onClick: () => console.log('try again!'),
    },
  },
};
