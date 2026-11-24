"use client";

import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { downloadJson } from "@/lib/download";
import { llmPrompt, templateExam, templateJson } from "@/lib/template";

export default function CreatePage() {
  return (
    <div className="sheet">
      <h1 className="page-title">Criar um simulado com IA</h1>
      <p className="lead">
        Você não precisa saber programar: dê o modelo para uma IA (ChatGPT,
        Claude, Gemini…), diga o conteúdo e importe o arquivo que ela devolver.
      </p>

      <div className="steps">
        <div className="step">
          <div className="step-n">1</div>
          <strong>Copie o pedido</strong>
          <p className="card-meta">
            O texto abaixo já explica à IA o perfil do aluno, o estilo das
            questões e o formato do arquivo.
          </p>
        </div>
        <div className="step">
          <div className="step-n">2</div>
          <strong>Cole na IA e envie o conteúdo</strong>
          <p className="card-meta">
            Preencha os campos entre colchetes e anexe fotos, capítulos ou a
            revisão da escola.
          </p>
        </div>
        <div className="step">
          <div className="step-n">3</div>
          <strong>Importe o JSON</strong>
          <p className="card-meta">
            Salve a resposta como <code>.json</code> (ou copie o texto) e use a
            tela <Link href="/importar">Importar</Link>.
          </p>
        </div>
      </div>

      <h2 className="section-title">Pedido para a IA</h2>
      <div className="codebox">
        <textarea
          className="mono"
          readOnly
          value={llmPrompt}
          aria-label="Pedido completo para a IA"
          onFocus={(e) => e.currentTarget.select()}
        />
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <CopyButton text={llmPrompt} label="Copiar pedido completo" />
      </div>

      <h2 className="section-title">Só o modelo do arquivo</h2>
      <p className="lead" style={{ marginBottom: 12 }}>
        Quer ver ou editar o formato à mão? Este modelo é um simulado válido.
      </p>
      <div className="row">
        <button
          type="button"
          className="btn"
          onClick={() => downloadJson("modelo-simulado.json", templateExam)}
        >
          Baixar modelo (.json)
        </button>
        <CopyButton text={templateJson} label="Copiar modelo" />
      </div>

      <div className="callout callout-warn" style={{ marginTop: 24 }}>
        <strong>Revise sempre o que a IA gerar.</strong> Confira o gabarito e as
        explicações com o material da escola antes de usar. A IA pode errar
        datas e fatos, e o app só confere o <em>formato</em>, não o conteúdo.
      </div>
    </div>
  );
}
