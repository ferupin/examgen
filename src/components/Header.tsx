"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import { ThemeToggle } from "./ThemeToggle";

/** Logo provisório: troque aqui quando a identidade visual estiver pronta. */
function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${brand.name} — início`}>
      <span className="logo-mark" aria-hidden="true">
        {"{?}"}
      </span>
      <span>{brand.name}</span>
    </Link>
  );
}

const links = [
  { href: "/", label: "Biblioteca" },
  { href: "/importar", label: "Importar" },
  { href: "/criar", label: "Criar com IA" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="topbar no-print">
      <Logo />
      <nav className="nav" aria-label="Principal">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={pathname === l.href ? "page" : undefined}
          >
            {l.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
