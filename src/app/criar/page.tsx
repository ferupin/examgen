"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Field } from "@/components/Field";
import { Segmented } from "@/components/Segmented";
import { downloadJson } from "@/lib/download";
import {
  buildPrompt,
  buildSkeleton,
  defaultFields,
  missingRequired,
  resetSimulado,
  type CreatorFields,
} from "@/lib/prompt";
import { clearCreator, loadCreator, saveCreator } from "@/lib/storage";

export default function CreatePage() {
  const [f, setF] = useState<CreatorFields>(defaultFields);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<"idle" | "ok" | "fail">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setF(loadCreator());
    setReady(true);
  }, []);

  // Salva depois de uma pausa na digitação (só depois de carregar, para não apagar o que já estava salvo).
  useEffect(() => {
    if (!ready) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSaved(saveCreator(f) ? "ok" : "fail");
    }, 400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [f, ready]);

  const set = <K extends keyof CreatorFields>(k: K, v: CreatorFields[K]) =>
    setF((cur) => ({ ...cur, [k]: v }));
  const text = (k: keyof CreatorFields) => ({
    value: f[k] as string,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => set(k, e.target.value as never),
  });

  const prompt = useMemo(() => buildPrompt(f), [f]);
  const missing = missingRequired(f);
  const filename = `${buildSkeleton(f).id}-esqueleto.json`;

  return (
    <div className="sheet">
      <h1 className="page-title">Criar um simulado com IA</h1>
      <p className="lead">
        Preencha os campos. O pedido para a IA é montado enquanto você digita.
        Depois é só copiar, colar em qualquer IA (ChatGPT, Claude, Gemini…) e
        enviar as imagens. O que você digita fica salvo neste navegador.
      </p>

      <fieldset className="form-group">
        <legend>Sobre o aluno e a escola</legend>
        <div className="form-grid">
          <Field label="Série ou ano" hint="(obrigatório)">
            <input type="text" placeholder="5º Ano" {...text("grade")} />
          </Field>
          <Field label="Idade">
            <input type="text" inputMode="numeric" placeholder="11" {...text("age")} />
          </Field>
          <Field label="Escola">
            <input type="text" placeholder="Nome do colégio" {...text("institution")} />
          </Field>
          <Field label="Cidade e estado">
            <input type="text" placeholder="Salvador-BA" {...text("city")} />
          </Field>
          <Field label="Referência curricular">
            <input type="text" placeholder="BNCC" {...text("curriculum")} />
          </Field>
          <div className="field wide">
            <Field label="Observações sobre o aluno" hint="(opcional)">
              <textarea
                style={{ minHeight: 70 }}
                placeholder="Ex.: prefere enunciados curtos; está em fase de alfabetização científica"
                {...text("studentNotes")}
              />
            </Field>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-group">
        <legend>Sobre este simulado</legend>
        <div className="form-grid">
          <Field label="Disciplina" hint="(obrigatório)">
            <input type="text" placeholder="História" {...text("subject")} />
          </Field>
          <Field label="Título" hint="(opcional)">
            <input type="text" placeholder="Revisão do 3º trimestre" {...text("title")} />
          </Field>
          <div className="field wide">
            <Field label="Assuntos" hint="(um por linha)">
              <textarea
                style={{ minHeight: 90 }}
                placeholder={"Patrimônio material e imaterial\nPreservação da memória"}
                {...text("topics")}
              />
            </Field>
          </div>
          <div className="field wide">
            <Field label="Material de estudo" hint="(livro, capítulos, páginas; um por linha)">
              <textarea
                style={{ minHeight: 70 }}
                placeholder={"Livro 04, capítulos 7 e 8\nRevisão da escola, 3º trimestre"}
                {...text("materials")}
              />
            </Field>
          </div>
          <div className="field wide">
            <span className="field-label">O que você vai enviar para a IA?</span>
            <Segmented
              name="inputMode"
              label="O que você vai enviar para a IA"
              value={f.inputMode}
              options={[
                { value: "images", label: "Só imagens" },
                { value: "text", label: "Só texto" },
              ]}
              onChange={(v) => set("inputMode", v)}
            />
          </div>
          <Field label="Questões objetivas" hint="(vazio = a IA decide)">
            <input type="text" inputMode="numeric" placeholder="30" {...text("objectiveCount")} />
          </Field>
          <Field label="Questões discursivas">
            <input type="text" inputMode="numeric" placeholder="0" {...text("openCount")} />
          </Field>
          <Field label="Número de partes" hint="(vazio = a IA decide)">
            <input type="text" inputMode="numeric" placeholder="4" {...text("partsCount")} />
          </Field>
          <div className="field">
            <span className="field-label">Nível</span>
            <Segmented
              name="difficulty"
              label="Nível"
              value={f.difficulty}
              options={[
                { value: "revisao", label: "Como a revisão" },
                { value: "medio", label: "Um pouco acima" },
                { value: "desafio", label: "Desafio" },
              ]}
              onChange={(v) => set("difficulty", v)}
            />
          </div>
          <div className="field wide">
            <Field label="Pedidos extras" hint="(opcional)">
              <textarea
                style={{ minHeight: 70 }}
                placeholder="Ex.: incluir uma questão com tabela; evitar datas"
                {...text("extraStyle")}
              />
            </Field>
          </div>
          <div className="field wide">
            <label className="check">
              <input
                type="checkbox"
                checked={f.mimicSchool}
                onChange={(e) => set("mimicSchool", e.target.checked)}
              />
              <span>Imitar o estilo das revisões da escola (contextualizado, sem pegadinhas)</span>
            </label>
            <label className="check" style={{ marginTop: 10 }}>
              <input
                type="checkbox"
                checked={f.allowExternal}
                onChange={(e) => set("allowExternal", e.target.checked)}
              />
              <span>Permitir que a IA consulte fontes externas (ela deve listar só as que usou)</span>
            </label>
          </div>
        </div>
      </fieldset>

      {missing.length > 0 && (
        <div className="callout">
          Faltam campos importantes: <strong>{missing.join(", ")}</strong>. O pedido
          mostra “[PREENCHER: …]” no lugar.
        </div>
      )}

      <h2 className="section-title">Pedido para a IA</h2>
      <p className="lead" style={{ marginBottom: 10 }}>
        O JSON no final já vai preenchido com os seus dados. A IA completa o resto
        a partir das imagens.
      </p>
      <div className="codebox">
        <textarea
          className="mono"
          readOnly
          style={{ minHeight: 320 }}
          value={prompt}
          aria-label="Pedido completo para a IA"
          onFocus={(e) => e.currentTarget.select()}
        />
      </div>

      <div className="copybar">
        <CopyButton text={prompt} label="Copiar pedido" />
        <button
          type="button"
          className="btn"
          onClick={() => downloadJson(filename, buildSkeleton(f))}
        >
          Baixar esqueleto
        </button>
        <button type="button" className="btn" onClick={() => setF((c) => resetSimulado(c))}>
          Novo simulado
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            if (window.confirm("Apagar tudo o que foi digitado aqui?")) {
              clearCreator();
              setF(defaultFields);
            }
          }}
        >
          Limpar tudo
        </button>
        <span className="save-line" aria-live="polite">
          {saved === "ok" && "Salvo neste navegador ✓"}
          {saved === "fail" && "Não foi possível salvar (armazenamento bloqueado)"}
        </span>
      </div>

      <div className="steps">
        <div className="step">
          <div className="step-n">1</div>
          <strong>Copie o pedido</strong>
        </div>
        <div className="step">
          <div className="step-n">2</div>
          <strong>Cole na IA e envie as imagens</strong>
        </div>
        <div className="step">
          <div className="step-n">3</div>
          <strong>
            Importe o JSON em <Link href="/importar">Importar</Link>
          </strong>
        </div>
      </div>
    </div>
  );
}
