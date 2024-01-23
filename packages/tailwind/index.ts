import type { Config } from 'tailwindcss';

export default {
  content: [''],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['var(--font-pacifico)'],
        raleway: ['var(--font-raleway)'],
        'work-sans': ['var(--font-work-sans)'],
      },
    },
  },
  plugins: [],
} satisfies Config;
