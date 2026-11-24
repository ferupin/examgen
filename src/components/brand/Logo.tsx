import Link from "next/link";
import { brand } from "@/config";
import { t } from "@/i18n";

/** Logotipo provisório. Troque aqui quando a identidade visual estiver pronta. */
export function Logo() {
  return (
    <Link
      href="/"
      aria-label={t("brand.home", { name: brand.name })}
      className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-ink no-underline"
    >
      <span
        className="grid size-9 place-items-center rounded-xl bg-accent text-[15px] font-extrabold text-accent-ink"
        aria-hidden="true"
      >
        {"{?}"}
      </span>
      <span>{brand.name}</span>
    </Link>
  );
}
