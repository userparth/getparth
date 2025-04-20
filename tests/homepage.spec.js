const { test, expect } = require("@playwright/test");

const BASE_URL = "https://getparth.com";

test.describe("Homepage Smoke Tests", () => {
	test("should load homepage with correct title", async ({ page }) => {
		await page.goto(BASE_URL);
		await expect(page).toHaveTitle(/Portfolio - Parth Sharma/);
	});

	test("should include SEO meta tags", async ({ page }) => {
		await page.goto(BASE_URL);
		const desc = await page.locator('meta[name="description"]');
		await expect(desc).toHaveAttribute("content", /Associate Engineering Head/);
	});

	test("should include sitemap in robots.txt", async ({ request }) => {
		const res = await request.get(`${BASE_URL}/robots.txt`);
		expect(res.status()).toBe(200);
		const body = await res.text();
		expect(body).toContain("Sitemap: https://getparth.com/sitemap.xml");
	});
});

test.describe("Navigation & Sections", () => {
	test("should scroll to About section", async ({ page }) => {
		await page.goto(BASE_URL);
		await page.click('a[href="#about"]');
		await expect(page.locator("#about")).toBeVisible();
	});

	test("should show sticky navbar on scroll", async ({ page }) => {
		await page.goto(BASE_URL);
		await page.mouse.wheel(0, 800);
		const nav = await page.locator("#main-nav");
		await expect(nav).toHaveClass(/sticky/);
	});
});
