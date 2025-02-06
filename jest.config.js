// jest.config.js
export default {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!lodash-es/)'  // Only needed if using ES modules in node_modules
  ]
};