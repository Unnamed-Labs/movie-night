import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_SERVER_URL: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.SERVER_URL,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
