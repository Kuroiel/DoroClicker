export default {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  extensionsToTreatAsEsm: ['.js'],
  moduleFileExtensions: ['js', 'mjs', 'json']
};