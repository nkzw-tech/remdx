module.exports = {
  extends: ['@nkzw'],
  overrides: [
    {
      files: ['packages/create-remdx/index.tsx'],
      rules: {
        'no-console': 0,
      },
    },
  ],
  rules: {
    'import/no-extraneous-dependencies': 0,
  },
};
