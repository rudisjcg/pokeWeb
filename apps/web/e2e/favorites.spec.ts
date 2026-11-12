import { expect, test } from "@playwright/test";
import { clearFavorites, hasTestAccount, signIn } from "./helpers";

test.skip(!hasTestAccount, "Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run the account tests");

test.beforeEach(async ({ page }) => {
  await signIn(page);
  await clearFavorites(page);
});

test("a signed-in user adds a pokemon once, sees it in their list and removes it", async ({ page }) => {
  await page.goto("/pokemon/pikachu");
  const add = page.getByRole("button", { name: "Añadir" });

  // A double click must not create two rows or surface an error.
  await add.dblclick();

  await expect(page.getByText("¡pikachu se añadió a tu lista!")).toBeVisible();
  await expect(page.getByText("No se pudo guardar el cambio")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "En tu lista" })).toBeVisible();

  await page.goto("/mylist");
  const items = page.getByTestId("favorite-item");
  await expect(items).toHaveCount(1);
  await expect(page.getByTestId("favorites-count")).toContainText("1");

  await items.first().click();
  await expect(page.getByRole("link", { name: "Detalles" })).toHaveAttribute("href", "/pokemon/pikachu");
  await page.getByRole("button", { name: "Quitar" }).click();

  await expect(items).toHaveCount(0);
  await expect(page.getByText("pikachu se quitó de tu lista.")).toBeVisible();
});

test("the pokemon page remembers a favorite after reloading", async ({ page }) => {
  await page.goto("/pokemon/bulbasaur");
  await page.getByRole("button", { name: "Añadir" }).click();
  await expect(page.getByRole("button", { name: "En tu lista" })).toBeVisible();

  await page.reload();

  await expect(page.getByRole("button", { name: "En tu lista" })).toBeVisible();
});

test("signing out from My List returns to the home page signed out", async ({ page }) => {
  await page.goto("/mylist");
  await page.getByRole("button", { name: "Cerrar sesión" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("button", { name: "Iniciar sesión" })).toBeVisible();
});
