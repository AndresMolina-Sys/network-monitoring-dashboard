import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const dirname = import.meta.dirname

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: ['recharts', 'react-router'],
  },

  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,eslint,prettier}.config.*',
      'e2e/**',
    ],

    projects: [
      {
        extends: true,

        test: {
          environment: 'jsdom',
          setupFiles: './src/test/setup.ts',
        },
      },

      {
        extends: true,

        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],

        test: {
          name: 'storybook',

          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),

            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
})
