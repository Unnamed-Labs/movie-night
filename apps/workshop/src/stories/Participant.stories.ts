import type { Meta, StoryObj } from '@storybook/react';
import { Participant } from '@movie/ui';

const meta = {
  title: 'Participant',
  component: Participant,
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
    name: {
      description: 'The name of the participant.',
      control: 'text',
    },
    image: {
      description: 'The profile image of the participant.',
      control: 'none',
    },
    'data-testid': {
      description: 'The test id of the participant component.',
      control: 'none',
      table: {
        defaultValue: { summary: 'participant' },
      },
    },
  },
  args: {
    name: 'Aaron',
    image: {
      src: 'src/stories/assets/saitaang.jpg',
      alt: "Aaron's profile pic",
    },
    'data-testid': 'participant',
  },
} satisfies Meta<typeof Participant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithoutImage: Story = {
  args: {
    image: undefined,
  },
};
