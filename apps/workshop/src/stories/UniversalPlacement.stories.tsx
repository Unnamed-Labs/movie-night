import type { Meta, StoryObj } from '@storybook/react';
import { UniversalPlacement } from '@movie/ui';
import { getImageUrl } from '../utils/getImageUrl';

const meta = {
  title: 'UniversalPlacement',
  component: UniversalPlacement,
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
    heading: {
      description: "The placement's heading.",
      control: 'text',
      table: {
        defaultValue: { summary: 'waiting' },
      },
    },
    description: {
      description: "The placement's description.",
      control: 'text',
      table: {
        defaultValue: { summary: 'for votes...' },
      },
    },
    image: {
      description: "The placement's image.",
      control: 'none',
    },
    primary: {
      description: "The placement's primary CTA.",
      control: 'none',
    },
    secondary: {
      description:
        "The placement's secondary CTA. This CTA cannot be displayed without the primary CTA.",
      control: 'none',
    },
    'data-testid': {
      description: 'The test id of the <UniversalPlacement /> component.',
      control: 'none',
      table: {
        defaultValue: { summary: 'universal-placement' },
      },
    },
  },
  args: {
    heading: 'waiting',
    description: 'for votes...',
    image: {
      src: getImageUrl('/waiting-1.jpeg'),
      alt: 'a monster patiently waits for their movie to begin',
    },
  },
} satisfies Meta<typeof UniversalPlacement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithPrimaryCta: Story = {
  args: {
    heading: 'woohoo!',
    description: "congrats you won free tix to see Monster's Inc",
    primary: {
      label: 'claim prize',
      onClick: () => console.log('my primary cta'),
    },
  },
};

export const WithBothCtas: Story = {
  args: {
    heading: 'uh oh!',
    description: 'an unexpected error occurred...',
    image: {
      src: getImageUrl('/error-1.jpeg'),
      alt: 'a monster sad their movie is ending',
    },
    primary: {
      label: 'return home',
      onClick: () => console.log('my primary cta'),
    },
    secondary: {
      label: 'contact us',
      onClick: () => console.log('my secondary cta'),
    },
  },
};
