import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: brand.name, template: `%s · ${brand.name}` },
  description: brand.tagline,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ebe3d1",
};

/** Aplica o tema salvo antes da primeira pintura (evita "piscar"). */
const themeScript = `try{if(localStorage.getItem("${brand.storagePrefix}.theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Header />
        <main className="shell">{children}</main>
        <footer className="site-footer">
          Seus dados ficam só neste navegador. Nada é enviado para a internet.
        </footer>
      </body>
    </html>
  );
}
