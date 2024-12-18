export default {
  'package.json': 'yarn workspaces run lint:package',
  '*.{js,ts,tsx}': 'yarn workspaces run lint --fix',
  '*.{js,ts,tsx,md}': 'prettier --write --ignore-unknown'
};
