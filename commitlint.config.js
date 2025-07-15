export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['init', 'feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert', 'build']],
  },
};
