import type { Meta, StoryObj } from '@storybook/react';
import { ProfileIcon } from '@movie/ui';
import { getImageUrl } from '../utils/getImageUrl';

const meta = {
  title: 'ProfileIcon',
  component: ProfileIcon,
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
      description: 'The profile icon src url.',
      control: 'text',
    },
    alt: {
      description: 'The profile icon alternative text.',
      control: 'none',
    },
    height: {
      description: 'The height of the icon.',
      control: 'number',
      table: {
        defaultValue: { summary: 48 },
      },
    },
    width: {
      description: 'The width of the icon.',
      control: 'number',
      table: {
        defaultValue: { summary: 48 },
      },
    },
    disabled: {
      description: 'Is the profile icon disabled?',
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
      },
    },
    selectable: {
      description: 'Is the profile icon selectable?',
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
      },
    },
    'data-testid': {
      description: 'The test id of the profile icon component.',
      control: 'none',
      table: {
        defaultValue: { summary: 'profile-icon' },
      },
    },
    onClick: {
      description: 'The onclick event handler of the profile icon component.',
      control: 'none',
    },
  },
  args: {
    src: getImageUrl('/saitaang.jpg'),
    alt: "Aaron's profile pic",
    height: 48,
    width: 48,
    disabled: false,
    selectable: false,
    'data-testid': 'profile-icon',
    onClick: () => console.log('profile icon clicked'),
  },
} satisfies Meta<typeof ProfileIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Selectable: Story = {
  args: {
    selectable: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
