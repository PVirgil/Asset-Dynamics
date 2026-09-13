"use client";

import { useEffect, useMemo, useState } from "react";
import { evaluateModel, ModelNode, sampleResponse, sensitivity } from "../lib/engine";

type Template = { name: string; description: string; nodes: ModelNode[] };

const templates: Template[] = [
  {
    name: "SaaS economics",
    description: "Connect customers, pricing, churn-like pressure, costs, profit, and a simple valuation multiple.",
    nodes: [
      { id: "1", name: "Customers", kind: "input", value: 1000, unit: "users", description: "Active paying customers" },
      { id: "2", name: "Price", kind: "input", value: 29, unit: "$/mo", description: "Monthly subscription price" },
      { id: "3", name: "VariableCost", kind: "input", value: 6, unit: "$/user", description: "Monthly marginal cost per customer" },
      { id: "4", name: "FixedCost", kind: "input", value: 12000, unit: "$/mo", description: "Monthly fixed operating cost" },
      { id: "5", name: "Multiple", kind: "input", value: 4, unit: "x", description: "Illustrative annual profit multiple" },
      { id: "6", name: "Revenue", kind: "formula", formula: "Customers * Price", unit: "$/mo" },
      { id: "7", name: "Cost", kind: "formula", formula: "FixedCost + Customers * VariableCost", unit: "$/mo" },
      { id: "8", name: "Profit", kind: "formula", formula: "Revenue - Cost", unit: "$/mo" },
      { id: "9", name: "Value", kind: "formula", formula: "max(0, Profit * 12 * Multiple)", unit: "$" }
    ]
  },
  {
    name: "AI API",
    description: "Model request volume, inference cost, reliability, monthly economics, and a utility objective.",
    nodes: [
      { id: "1", name: "Requests", kind: "input", value: 500000, unit: "/mo" },
      { id: "2", name: "PricePer1K", kind: "input", value: 1.5, unit: "$" },
      { id: "3", name: "CostPer1K", kind: "input", value: 0.55, unit: "$" },
      { id: "4", name: "SuccessRate", kind: "input", value: 0.96, unit: "ratio" },
      { id: "5", name: "FixedCost", kind: "input", value: 9000, unit: "$/mo" },
      { id: "6", name: "Revenue", kind: "formula", formula: "Requests / 1000 * PricePer1K", unit: "$/mo" },
      { id: "7", name: "ComputeCost", kind: "formula", formula: "Requests / 1000 * CostPer1K", unit: "$/mo" },
      { id: "8", name: "Profit", kind: "formula", formula: "Revenue - ComputeCost - FixedCost", unit: "$/mo" },
      { id: "9", name: "SuccessfulRequests", kind: "formula", formula: "Requests * SuccessRate", unit: "/mo" },
      { id: "10", name: "Utility", kind: "formula", formula: "Profit + SuccessfulRequests * 0.01", unit: "score" }
    ]
  },
  {
    name: "Growth system",
    description: "A small nonlinear system illustrating how a controllable acquisition input affects value.",
    nodes: [
      { id: "1", name: "Traffic", kind: "input", value: 50000, unit: "visits" },
      { id: "2", name: "Conversion", kind: "input", value: 0.035, unit: "ratio" },
      { id: "3", name: "Price", kind: "input", value: 80, unit: "$" },
      { id: "4", name: "Retention", kind: "input", value: 0.82, unit: "ratio" },
      { id: "5", name: "Customers", kind: "formula", formula: "Traffic * Conversion", unit: "customers" },
      { id: "6", name: "Revenue", kind: "formula", formula: "Customers * Price", unit: "$" },
      { id: "7", name: "LifetimeFactor", kind: "formula", formula: "1 / max(0.01, 1 - Retention)", unit: "x" },
      { id: "8", name: "Value", kind: "formula", formula: "Revenue * LifetimeFactor", unit: "$" }
    ]
  }
];

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

function fmt(v: number | undefined) {
  if (v === undefined || !Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a >= 1_000_000) return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (a >= 1000) return v.toLocaleString(undefined, { maximumFractionDigits: 1 });
  if (a < 0.01 && a !== 0) return v.toExponential(2);
  return v.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function Sparkline({ points }: { points: {x:number;y:number}[] }) {
  if (points.length < 2) return <div className="chart-empty">Choose a valid input and output.</div>;
  const w = 620, h = 190, pad = 18;
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const sx = (x:number) => pad + (x-minX)/(maxX-minX || 1)*(w-2*pad);
  const sy = (y:number) => h-pad - (y-minY)/(maxY-minY || 1)*(h-2*pad);
  const path = points.map((p,i)=>`${i?"L":"M"} ${sx(p.x).toFixed(2)} ${sy(p.y).toFixed(2)}`).join(" ");
  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Output response curve">
      <line x1={pad} y1={h-pad} x2={w-pad} y2={h-pad} className="axis"/>
      <line x1={pad} y1={pad} x2={pad} y2={h-pad} className="axis"/>
      <path d={path} className="curve" fill="none"/>
    </svg>
  );
}

export default function DynamicsLab() {
  const [nodes, setNodes] = useState<ModelNode[]>(() => clone(templates[0].nodes));
  const [inputName, setInputName] = useState("Price");
  const [outputName, setOutputName] = useState("Value");
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("asset-dynamics-model");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setNodes(parsed);
      } catch {}
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("asset-dynamics-model", JSON.stringify(nodes));
  }, [nodes, hydrated]);

  const result = useMemo(() => evaluateModel(nodes), [nodes]);
  const inputs = nodes.filter(n => n.kind === "input");
  const outputs = nodes.filter(n => n.kind === "formula");
  const deriv = useMemo(() => sensitivity(nodes, inputName, outputName), [nodes, inputName, outputName]);
  const points = useMemo(() => sampleResponse(nodes, inputName, outputName), [nodes, inputName, outputName]);

  function update(id:string, patch: Partial<ModelNode>) {
    setNodes(ns => ns.map(n => n.id === id ? { ...n, ...patch } : n));
  }

  function addNode(kind: "input" | "formula") {
    const used = new Set(nodes.map(n => n.name));
    let k = 1, name = kind === "input" ? "NewInput" : "NewOutput";
    while (used.has(name)) name = `${kind === "input" ? "NewInput" : "NewOutput"}${++k}`;
    setNodes(ns => [...ns, {
      id: crypto.randomUUID(),
      name,
      kind,
      value: kind === "input" ? 1 : undefined,
      formula: kind === "formula" ? (inputs[0]?.name ?? "1") : undefined
    }]);
  }

  function removeNode(id:string) {
    setNodes(ns => ns.filter(n => n.id !== id));
  }

  function loadTemplate(t:Template) {
    const next = clone(t.nodes);
    setNodes(next);
    const firstInput = next.find(n=>n.kind==="input")?.name ?? "";
    const preferredOutput = next.find(n=>n.name==="Value")?.name ?? next.filter(n=>n.kind==="formula").at(-1)?.name ?? "";
    setInputName(firstInput);
    setOutputName(preferredOutput);
  }

  function exportModel() {
    const blob = new Blob([JSON.stringify(nodes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "asset-dynamics-model.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function importModel(file: File | undefined) {
    if (!file) return;
    file.text().then(text => {
      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error();
        setNodes(parsed);
        setNotice("Model imported.");
      } catch {
        setNotice("That file is not a valid Asset Dynamics model.");
      }
    });
  }

  const derivativeExplanation = deriv == null ? "Select a valid pair." :
    `Near the current model state, increasing ${inputName} by 1 unit changes ${outputName} by about ${fmt(deriv)} units. This is a numerical approximation of ∂${outputName}/∂${inputName}.`;

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <div className="eyebrow">COMPUTATIONAL MODELING LAB</div>
          <h1>Asset Dynamics</h1>
          <p>Build a system as variables and equations. Then inspect its outputs, response curve, and local sensitivity—the calculus hiding inside real work.</p>
        </div>
        <div className="hero-badge">v0.1</div>
      </header>

      <section className="toolbar">
        <div className="templates">
          {templates.map(t => <button key={t.name} onClick={()=>loadTemplate(t)}>{t.name}</button>)}
        </div>
        <div className="actions">
          <button onClick={exportModel}>Export JSON</button>
          <label className="button-label">Import JSON<input type="file" accept="application/json" onChange={e=>importModel(e.target.files?.[0])}/></label>
        </div>
      </section>

      {notice && <div className="notice" role="status">{notice}</div>}

      <div className="layout">
        <section className="panel model-panel">
          <div className="section-head">
            <div><h2>Model</h2><p>Names become variables. Formulas can reference any earlier or resolvable node.</p></div>
            <div className="mini-actions">
              <button onClick={()=>addNode("input")}>+ Input</button>
              <button onClick={()=>addNode("formula")}>+ Rule</button>
            </div>
          </div>

          <div className="node-list">
            {nodes.map(n => (
              <article key={n.id} className={`node ${n.kind}`}>
                <div className="node-top">
                  <span className="kind">{n.kind}</span>
                  <button className="danger" aria-label={`Delete ${n.name}`} onClick={()=>removeNode(n.id)}>×</button>
                </div>
                <div className="fields">
                  <label>Name<input value={n.name} onChange={e=>update(n.id,{name:e.target.value.replace(/\s+/g,"")})}/></label>
                  {n.kind === "input" ? (
                    <label>Value<input type="number" step="any" value={n.value ?? 0} onChange={e=>update(n.id,{value:Number(e.target.value)})}/></label>
                  ) : (
                    <label className="wide">Formula<input value={n.formula ?? ""} onChange={e=>update(n.id,{formula:e.target.value})}/></label>
                  )}
                  <label>Unit<input value={n.unit ?? ""} onChange={e=>update(n.id,{unit:e.target.value})}/></label>
                </div>
                <div className="node-result">
                  <span>{n.name || "Unnamed"}</span>
                  <strong>{fmt(result.values[n.name])}</strong>
                  <small>{n.unit}</small>
                </div>
                {result.errors[n.name] && <div className="error">{result.errors[n.name]}</div>}
              </article>
            ))}
          </div>
          <p className="syntax">Formula syntax: + − * / ^, parentheses, and exp(), log(), sqrt(), abs(), min(), max(), pow(). Variable names are case-sensitive.</p>
        </section>

        <aside className="right-stack">
          <section className="panel">
            <div className="section-head"><div><h2>Sensitivity</h2><p>Numerical local derivative using a central difference.</p></div></div>
            <div className="pair">
              <label>Input<select value={inputName} onChange={e=>setInputName(e.target.value)}>{inputs.map(n=><option key={n.id}>{n.name}</option>)}</select></label>
              <span>→</span>
              <label>Output<select value={outputName} onChange={e=>setOutputName(e.target.value)}>{outputs.map(n=><option key={n.id}>{n.name}</option>)}</select></label>
            </div>
            <div className="derivative">
              <div className="notation">∂{outputName || "y"} / ∂{inputName || "x"}</div>
              <div className="big">{deriv == null ? "—" : fmt(deriv)}</div>
            </div>
            <p className="explain">{derivativeExplanation}</p>
          </section>

          <section className="panel">
            <div className="section-head"><div><h2>Response curve</h2><p>{outputName} as {inputName} moves ±50% around its current value.</p></div></div>
            <Sparkline points={points}/>
          </section>

          <section className="panel learn">
            <div className="section-head"><div><h2>Learn the calculus</h2><p>The software should expose the math, not hide it.</p></div></div>
            <div className="lesson">
              <div className="lesson-number">01</div>
              <div><strong>Derivative = local sensitivity</strong><p>If y=f(x), then dy/dx asks how quickly y changes for a tiny change in x. Here, your model supplies f.</p></div>
            </div>
            <div className="lesson">
              <div className="lesson-number">02</div>
              <div><strong>Chain rule = dependency propagation</strong><p>If Price changes Revenue, Revenue changes Profit, and Profit changes Value, the total Price→Value effect propagates through the dependency chain.</p></div>
            </div>
            <div className="lesson">
              <div className="lesson-number">03</div>
              <div><strong>Optimization comes next</strong><p>A future version can use these sensitivities to search for the inputs that maximize an objective under constraints.</p></div>
            </div>
          </section>
        </aside>
      </div>

      <footer>
        <span>Asset Dynamics • local-first prototype</span>
        <span>Saved automatically in this browser</span>
      </footer>
    </main>
  );
}
