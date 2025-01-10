import nkzw from '@nkzw/eslint-config';

export default [
  ...nkzw,
  {
    ignores: [
      'dist/',
      'packages/*/index.js',
      'packages/create-remdx/template',
      'packages/remdx/index.d.ts',
    ],
  },
  {
    rules: {
      'import/no-extraneous-dependencies': 0,
    },
  },
  {
    files: ['packages/create-remdx/index.tsx'],
    rules: {
      'no-console': 0,
    },
  },
];
