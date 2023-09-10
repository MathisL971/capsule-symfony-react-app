const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://127.0.0.1:8000",
  },
  env: {
    // DEV_BACKEND: "http://localhost:3002/api",
    DEV_BACKEND: "https://127.0.0.1:8000",
  },
});
