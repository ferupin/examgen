"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ExamRunner } from "@/components/ExamRunner";

function Inner() {
  const id = useSearchParams().get("id");
  if (!id)
    return (
      <div className="sheet">
        <h1 className="page-title">Nenhum simulado escolhido</h1>
        <p className="lead">Abra um simulado pela biblioteca.</p>
        <Link className="btn btn-primary" href="/">
          Ir para a biblioteca
        </Link>
      </div>
    );
  return <ExamRunner examId={id} />;
}

export default function ProvaPage() {
  return (
    <Suspense
      fallback={
        <div className="sheet">
          <p>Carregando…</p>
        </div>
      }
    >
      <Inner />
    </Suspense>
  );
}
