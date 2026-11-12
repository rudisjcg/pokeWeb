import { expect, test } from "@playwright/test";

test("the home hero renders the 3D scene and ten featured pokemon", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.getByTestId("pokemon-card")).toHaveCount(10);
});

test("explore button leads to the Pokédex", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Explorar la Pokédex" }).click();

  await expect(page).toHaveURL("/pokedex");
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the hero shows a still image instead of the 3D scene", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("hero-static")).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
  });
});
