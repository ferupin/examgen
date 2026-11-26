import { expect, test } from "@playwright/test";
import { catalog, questionsOf } from "./helpers";

const cie = catalog("ciencias-4ano.json");
const qs = questionsOf(cie);

test.describe("Impressão", () => {
  for (const [label, mode] of [["Caderno de prova", "caderno"], ["Gabarito", "gabarito"]] as const) {
    test(`${mode}: folha própria, conteúdo certo e PDF válido`, async ({ page }) => {
      await page.goto(`/prova?id=${cie.id}`);
      await page.getByRole("button", { name: "Imprimir" }).click();
      await page.getByRole("menuitem", { name: new RegExp(`^${label}`) }).click();
      await page.emulateMedia({ media: "print" });
      const sheet = page.locator(`[data-print-mode="${mode}"]`);
      await expect(sheet).toBeVisible();
      await expect(page.locator("article.sheet")).toBeHidden(); // a tela interativa não vai ao papel
      const text = await sheet.innerText();
      if (mode === "caderno") {
        expect(text).toContain("Nome:");
        expect(text).not.toMatch(/Resposta:|Gabarito/);
        expect(await sheet.locator(".print-line").count()).toBeGreaterThanOrEqual(6); // linhas da discursiva
        expect(await sheet.locator(".print-bubble").count()).toBe(qs.filter((q) => q.type === "multiple_choice").length * 4);
      } else {
        expect(text).toContain("Gabarito:");
        expect(text).toContain("Resposta:");
        expect(await sheet.locator(".print-key span").count()).toBe(qs.filter((q) => q.type === "multiple_choice").length);
      }
      // fundo branco no papel (não o bege da tela); espera a transição de cor do tema terminar
      await page.waitForTimeout(500);
      expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(255, 255, 255)");
      const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
      const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
      expect(pages).toBeGreaterThanOrEqual(1);
      expect(pages).toBeLessThanOrEqual(3);
    });
  }

  test("'Prova corrigida' fica desligada até corrigir", async ({ page }) => {
    await page.goto(`/prova?id=${cie.id}`);
    await page.getByRole("button", { name: "Imprimir" }).click();
    await expect(page.getByRole("menuitem", { name: /^Prova corrigida/ })).toBeDisabled();
  });
});
