import type { Meta, StoryObj } from '@storybook/react';
import { MovieCard } from '@movie/ui';

const meta = {
  title: 'MovieCard',
  component: MovieCard,
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
    title: {
      description: 'The movie title.',
      control: 'text',
    },
    runtime: {
      description: 'The movie runtime.',
      control: 'text',
    },
    date: {
      description: 'The movie release date.',
      control: 'text',
    },
    image: {
      description: 'The poster image of the movie.',
      control: 'none',
    },
    rating: {
      description: 'The viewership rating of the movie.',
      control: 'radio',
      options: ['G', 'PG', 'PG-13', 'R'],
      table: {
        defaultValue: { summary: 'PG' },
      },
    },
    disabled: {
      description: 'Is the card disabled?',
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
      },
    },
    'data-testid': {
      description: 'The test id of the card component.',
      control: 'none',
      table: {
        defaultValue: { summary: 'movie-card' },
      },
    },
    onClick: {
      description: 'The onclick event handler of the card component.',
      control: 'none',
    },
  },
  args: {
    title: 'Shrek',
    runtime: '1h 30m',
    date: '05/18/2001',
    image: {
      src: '/movie-night/shrek.jpg',
      alt: 'Shrek poster',
    },
    rating: 'PG',
    disabled: false,
    'data-testid': 'movie-card',
    onClick: () => console.log('movie clicked'),
  },
} satisfies Meta<typeof MovieCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Selectable: Story = {
  args: {
    user: {
      src: '/movie-night/saitaang.jpg',
      alt: 'user profile pic',
    },
  },
};
