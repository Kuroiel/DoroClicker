module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/unit/**/*.test.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  }
};