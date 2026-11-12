import { expect, test } from "@playwright/test";

test("signed-out visitors of /mylist land on the home page with the login open", async ({ page }) => {
  await page.goto("/mylist");

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("dialog", { name: "Inicia sesión en tu cuenta" })).toBeVisible();
});

test("sign-up rejects a username shorter than 3 characters", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Registrarse" }).click();
  const dialog = page.getByRole("dialog", { name: "Crea tu cuenta" });

  await dialog.getByLabel("Nombre de usuario").fill("ab");
  await dialog.getByRole("button", { name: "Crear cuenta" }).click();

  await expect(dialog.getByRole("alert")).toHaveText("El nombre de usuario debe tener entre 3 y 20 caracteres.");
});
