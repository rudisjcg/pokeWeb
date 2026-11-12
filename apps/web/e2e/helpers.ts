import { expect, type Page } from "@playwright/test";

export const testAccount = {
  email: process.env.E2E_USER_EMAIL ?? "",
  password: process.env.E2E_USER_PASSWORD ?? "",
};

/** The account tests need a real Supabase project; without credentials they are skipped. */
export const hasTestAccount = testAccount.email !== "" && testAccount.password !== "";

export async function signIn(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  const dialog = page.getByRole("dialog", { name: "Inicia sesión en tu cuenta" });
  await dialog.getByLabel("Correo electrónico").fill(testAccount.email);
  await dialog.getByLabel("Contraseña").fill(testAccount.password);
  await dialog.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByTestId("nav-user")).toBeVisible();
}

/** Leaves the test account with an empty list, whatever a previous run left behind. */
export async function clearFavorites(page: Page): Promise<void> {
  await page.goto("/mylist");
  const items = page.getByTestId("favorite-item");
  await expect(page.getByTestId("favorites-count")).toBeVisible();
  while ((await items.count()) > 0) {
    const before = await items.count();
    await items.first().click();
    await page.getByRole("button", { name: "Quitar" }).click();
    await expect(items).toHaveCount(before - 1);
  }
}
