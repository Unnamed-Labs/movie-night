import { type Config } from 'tailwindcss';
import baseConfig from '@movie/tailwind-config';

export default {
  content: ['./src/**/*.tsx'],
  presets: [baseConfig],
  theme: {
    extend: {
      keyframes: {
        characterfade: {
          '0%': {
            opacity: '0',
            transform: 'translate(0px, 64px)',
          },
          '100%': {
            opacity: '1',
          },
        },
        armleftslide: {
          '0%': {
            opacity: '0',
          },
          '75%': {
            opacity: '1',
            transform: 'translate(0px, -5px)',
          },
        },
        armrightslide: {
          '0%': {
            opacity: '0',
          },
          '75%': {
            opacity: '1',
            transform: 'translate(0px, -10px)',
          },
        },
      },
    },
  },
} satisfies Config;
