// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  }
};