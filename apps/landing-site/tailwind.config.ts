import { type Config } from 'tailwindcss';
import baseConfig from '@movie/tailwind-config';

export default {
  content: ['./src/**/*.tsx'],
  presets: [baseConfig],
  theme: {
    extend: {
      keyframes: {
        characterslide: {
          '0%': {
            opacity: '0',
            transform: 'translate(0px, 0px)',
          },
          '25%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translate(0px, -85px)',
          },
        },
        armslide: {
          '0%': {
            transform: 'translate(0px, 0px)',
          },
          '75%': {
            transform: 'translate(0px, -90px)',
          },
          '100%': {
            transform: 'translate(0px, -85px)',
          },
        },
      },
    },
  },
} satisfies Config;
