import { expect, test } from "@playwright/test";

test("filtering by type shows only that type and can be removed", async ({ page }) => {
  await page.goto("/pokedex");
  const cards = page.getByTestId("pokemon-card");
  await expect(cards.first()).toContainText("bulbasaur");

  await page.getByRole("button", { name: "fire", exact: true }).click();

  await expect(cards.first()).toContainText("charmander");
  await expect(cards).toHaveCount(12);
  for (const card of await cards.all()) await expect(card).toContainText("fire");

  await page.getByRole("button", { name: "Todos" }).click();

  await expect(cards.first()).toContainText("bulbasaur");
});

test("a search overrides the type filter and clearing it restores the filter", async ({ page }) => {
  await page.goto("/pokedex");
  const cards = page.getByTestId("pokemon-card");
  await page.getByRole("button", { name: "water", exact: true }).click();
  await expect(cards.first()).toContainText("squirtle");

  await page.getByLabel("Buscar Pokémon").fill(" Pikachu ");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();

  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("pikachu");

  await page.getByRole("button", { name: "Quitar búsqueda" }).click();

  await expect(cards.first()).toContainText("squirtle");
  await expect(page.getByRole("button", { name: "water", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("searching for something that does not exist explains it", async ({ page }) => {
  await page.goto("/pokedex");

  await page.getByLabel("Buscar Pokémon").fill("noexiste");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();

  await expect(page.getByRole("status")).toContainText("No hay ningún Pokémon con ese nombre o número");
});

test("load more adds twelve cards", async ({ page }) => {
  await page.goto("/pokedex");
  const cards = page.getByTestId("pokemon-card");
  await expect(cards).toHaveCount(12);

  await page.getByRole("button", { name: "Cargar más" }).click();

  await expect(cards).toHaveCount(24);
});
