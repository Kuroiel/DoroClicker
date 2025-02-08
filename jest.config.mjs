export default {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  extensionsToTreatAsEsm: ['.ts','.js'],
  moduleFileExtensions: ['js', 'mjs', 'json']
};