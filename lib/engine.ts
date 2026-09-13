export type NodeKind = "input" | "formula";

export type ModelNode = {
  id: string;
  name: string;
  kind: NodeKind;
  value?: number;
  formula?: string;
  unit?: string;
  description?: string;
};

export type EvalResult = {
  values: Record<string, number>;
  errors: Record<string, string>;
};

type Token =
  | { type: "number"; value: number }
  | { type: "ident"; value: string }
  | { type: "op"; value: string }
  | { type: "paren"; value: "(" | ")" }
  | { type: "comma"; value: "," };

const functions: Record<string, (...args: number[]) => number> = {
  exp: Math.exp,
  log: Math.log,
  sqrt: Math.sqrt,
  abs: Math.abs,
  min: Math.min,
  max: Math.max,
  pow: Math.pow
};

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i + 1;
      while (j < src.length && /[0-9.eE+-]/.test(src[j])) {
        const candidate = src.slice(i, j + 1);
        if (!/^(\d+\.?\d*|\.\d+)([eE][+-]?\d*)?$/.test(candidate)) break;
        j++;
      }
      const raw = src.slice(i, j);
      const n = Number(raw);
      if (!Number.isFinite(n)) throw new Error(`Invalid number: ${raw}`);
      out.push({ type: "number", value: n });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i + 1;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      out.push({ type: "ident", value: src.slice(i, j) });
      i = j;
      continue;
    }
    if ("+-*/^".includes(c)) { out.push({ type: "op", value: c }); i++; continue; }
    if (c === "(" || c === ")") { out.push({ type: "paren", value: c }); i++; continue; }
    if (c === ",") { out.push({ type: "comma", value: c }); i++; continue; }
    throw new Error(`Unsupported character: ${c}`);
  }
  return out;
}

class Parser {
  private i = 0;
  constructor(private tokens: Token[], private vars: Record<string, number>) {}

  parse(): number {
    const v = this.expr();
    if (this.i !== this.tokens.length) throw new Error("Unexpected token");
    return v;
  }

  private peek() { return this.tokens[this.i]; }
  private take() { return this.tokens[this.i++]; }

  private expr(): number {
    let v = this.term();
    while (this.peek()?.type === "op" && ["+", "-"].includes((this.peek() as any).value)) {
      const op = (this.take() as any).value;
      const r = this.term();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  }

  private term(): number {
    let v = this.power();
    while (this.peek()?.type === "op" && ["*", "/"].includes((this.peek() as any).value)) {
      const op = (this.take() as any).value;
      const r = this.power();
      v = op === "*" ? v * r : v / r;
    }
    return v;
  }

  private power(): number {
    let v = this.unary();
    if (this.peek()?.type === "op" && (this.peek() as any).value === "^") {
      this.take();
      v = Math.pow(v, this.power());
    }
    return v;
  }

  private unary(): number {
    if (this.peek()?.type === "op" && ["+", "-"].includes((this.peek() as any).value)) {
      const op = (this.take() as any).value;
      const v = this.unary();
      return op === "-" ? -v : v;
    }
    return this.primary();
  }

  private primary(): number {
    const t = this.take();
    if (!t) throw new Error("Unexpected end of formula");
    if (t.type === "number") return t.value;
    if (t.type === "ident") {
      if (this.peek()?.type === "paren" && (this.peek() as any).value === "(") {
        this.take();
        const args: number[] = [];
        if (!(this.peek()?.type === "paren" && (this.peek() as any).value === ")")) {
          args.push(this.expr());
          while (this.peek()?.type === "comma") { this.take(); args.push(this.expr()); }
        }
        const close = this.take();
        if (!close || close.type !== "paren" || close.value !== ")") throw new Error("Expected )");
        const fn = functions[t.value];
        if (!fn) throw new Error(`Unknown function: ${t.value}`);
        return fn(...args);
      }
      if (!(t.value in this.vars)) throw new Error(`Unknown variable: ${t.value}`);
      return this.vars[t.value];
    }
    if (t.type === "paren" && t.value === "(") {
      const v = this.expr();
      const close = this.take();
      if (!close || close.type !== "paren" || close.value !== ")") throw new Error("Expected )");
      return v;
    }
    throw new Error("Expected a number, variable, or (");
  }
}

export function evaluateFormula(formula: string, vars: Record<string, number>): number {
  const v = new Parser(tokenize(formula), vars).parse();
  if (!Number.isFinite(v)) throw new Error("Result is not finite");
  return v;
}

export function evaluateModel(nodes: ModelNode[]): EvalResult {
  const values: Record<string, number> = {};
  const errors: Record<string, string> = {};
  const formulas = nodes.filter(n => n.kind === "formula");

  for (const n of nodes.filter(n => n.kind === "input")) {
    values[n.name] = Number(n.value ?? 0);
  }

  const pending = [...formulas];
  let passes = 0;
  while (pending.length && passes <= formulas.length + 1) {
    let progressed = false;
    for (let i = pending.length - 1; i >= 0; i--) {
      const n = pending[i];
      try {
        const v = evaluateFormula(n.formula ?? "0", values);
        values[n.name] = v;
        pending.splice(i, 1);
        progressed = true;
      } catch {
        // Try again after other dependencies resolve.
      }
    }
    if (!progressed) break;
    passes++;
  }

  for (const n of pending) {
    try { evaluateFormula(n.formula ?? "0", values); }
    catch (e) { errors[n.name] = e instanceof Error ? e.message : "Formula error"; }
  }
  return { values, errors };
}

export function sensitivity(nodes: ModelNode[], inputName: string, outputName: string): number | null {
  const baseNode = nodes.find(n => n.name === inputName && n.kind === "input");
  if (!baseNode) return null;
  const x = Number(baseNode.value ?? 0);
  const h = Math.max(Math.abs(x) * 1e-5, 1e-5);

  const plus = nodes.map(n => n.id === baseNode.id ? { ...n, value: x + h } : n);
  const minus = nodes.map(n => n.id === baseNode.id ? { ...n, value: x - h } : n);
  const yp = evaluateModel(plus).values[outputName];
  const ym = evaluateModel(minus).values[outputName];
  if (!Number.isFinite(yp) || !Number.isFinite(ym)) return null;
  return (yp - ym) / (2 * h);
}

export function sampleResponse(nodes: ModelNode[], inputName: string, outputName: string, steps = 41) {
  const input = nodes.find(n => n.name === inputName && n.kind === "input");
  if (!input) return [];
  const base = Number(input.value ?? 0);
  const span = Math.max(Math.abs(base) * 0.5, 1);
  const start = base - span;
  const end = base + span;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < steps; i++) {
    const x = start + (end - start) * i / (steps - 1);
    const changed = nodes.map(n => n.id === input.id ? { ...n, value: x } : n);
    const y = evaluateModel(changed).values[outputName];
    if (Number.isFinite(y)) pts.push({ x, y });
  }
  return pts;
}
