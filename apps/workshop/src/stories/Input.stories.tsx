import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@movie/ui';

const meta = {
  title: 'Input',
  component: Input,
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
      description: 'The label of the input component.',
      control: 'text',
    },
    required: {
      description: 'Is the field required?',
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
      },
    },
    defaultValue: {
      description: 'The default value of the input component.',
      control: 'text',
    },
    type: {
      description: 'What type of input field is this?',
      control: 'radio',
      options: ['text', 'email', 'password', 'tel'],
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      description: 'The placeholder text of the input component.',
      control: 'text',
    },
    helpText: {
      description: 'The help text of the input component.',
      control: 'text',
    },
    error: {
      description: 'The error text of the input component.',
      control: 'text',
    },
    'data-testid': {
      description: 'The test id of the input component.',
      control: 'none',
      table: {
        defaultValue: { summary: 'input' },
      },
    },
    onChange: {
      description: 'The onchange event handler of the input component.',
      control: 'none',
    },
  },
  args: {
    label: 'First name',
    required: false,
    defaultValue: '',
    type: 'text',
    placeholder: '',
    helpText: '',
    error: '',
    'data-testid': 'input',
    onChange: (val) => console.log(val),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'Aaron',
  },
};

export const WithType: Story = {
  args: {
    label: 'Email',
    type: 'email',
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'asdf@xyz.com',
  },
};

export const WithHelpText: Story = {
  args: {
    helpText: 'Enter your legal given name',
  },
};

export const WithError: Story = {
  args: {
    error: 'Please enter your first name',
  },
};
