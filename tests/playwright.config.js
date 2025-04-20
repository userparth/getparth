const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
	testDir: "./tests",
	use: {
		baseURL: "", // Removed because absolute URLs are used
		headless: true,
		viewport: { width: 1280, height: 800 },
		ignoreHTTPSErrors: true,
	},
});
