import Link from "next/link";
import { appVersion } from "@/config";
import { t } from "@/i18n";

export function Footer() {
  return (
    <footer className="mx-auto max-w-[920px] px-4 pb-9 text-center text-[13px] text-muted print:hidden">
      <p>{t("footer.privacy")}</p>
      <p>
        {t("footer.version", { version: appVersion })} ·{" "}
        <Link href="/versoes">{t("footer.versions")}</Link>
      </p>
    </footer>
  );
}
