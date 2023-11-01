import baseConfig from '../../jest.config.base';

import packageJson from './package.json';

export default {
  ...baseConfig,
  displayName: packageJson.name
};
