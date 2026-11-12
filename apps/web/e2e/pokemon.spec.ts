import { expect, test } from "@playwright/test";

test("a pokemon page shows its six base stats and their total", async ({ page }) => {
  await page.goto("/pokemon/pikachu");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("pikachu");
  await expect(page.getByTestId("stat-bar")).toHaveCount(6);
  await expect(page.getByRole("meter", { name: "Velocidad" })).toHaveAttribute("aria-valuenow", "90");
  await expect(page.getByTestId("stat-total")).toHaveText("320");
  await expect(page.getByText("0,4 m")).toBeVisible();
});

test("next and previous walk the national list", async ({ page }) => {
  await page.goto("/pokemon/pikachu");

  await page.getByRole("link", { name: /^Siguiente/ }).click();
  await expect(page).toHaveURL("/pokemon/raichu");

  await page.getByRole("link", { name: /^Anterior/ }).click();
  await expect(page).toHaveURL("/pokemon/pikachu");
});

test("the first pokemon has no previous link", async ({ page }) => {
  await page.goto("/pokemon/bulbasaur");

  await expect(page.getByRole("link", { name: /^Siguiente/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Anterior/ })).toHaveCount(0);
});

test("an unknown pokemon is a 404", async ({ page }) => {
  const response = await page.goto("/pokemon/zzz");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Página no encontrada" })).toBeVisible();
});
