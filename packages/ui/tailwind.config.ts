import { type Config } from 'tailwindcss';
import baseConfig from '@movie/tailwind-config';

export default {
  // prefix ui lib classes to avoid conflicting with the app
  prefix: 'ui-',
  content: ['./src/**/*.tsx'],
  presets: [baseConfig],
} satisfies Config;
