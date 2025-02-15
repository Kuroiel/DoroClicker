export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.svelte$': 'svelte-jester',
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'svelte'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
};