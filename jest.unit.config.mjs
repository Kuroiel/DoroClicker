export default {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/unit/**/*.test.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  }
};