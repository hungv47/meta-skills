type YamlValue = null | boolean | number | string | YamlValue[] | { [key: string]: YamlValue };

type ParsedLine = {
  indent: number;
  text: string;
};

function parseScalar(raw: string): YamlValue {
  const value = raw.trim();
  if (value === "") return "";
  if (value === "null") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((part) => parseScalar(part.trim()));
  }
  return value;
}

function parseKeyValue(text: string): [string, string] {
  const idx = text.indexOf(":");
  if (idx === -1) throw new Error(`Expected key/value line, got: ${text}`);
  return [text.slice(0, idx).trim(), text.slice(idx + 1).trim()];
}

function cleanLines(input: string): ParsedLine[] {
  return input
    .replace(/\t/g, "  ")
    .split(/\r?\n/)
    .map((raw) => raw.replace(/\s+$/, ""))
    .filter((raw) => raw.trim() !== "" && !raw.trim().startsWith("#"))
    .map((raw) => ({
      indent: raw.match(/^ */)?.[0].length ?? 0,
      text: raw.trim(),
    }));
}

function parseBlock(lines: ParsedLine[], start: number, indent: number): [YamlValue, number] {
  if (start >= lines.length || lines[start].indent < indent) return [{}, start];
  const isArray = lines[start].indent === indent && lines[start].text.startsWith("- ");
  return isArray ? parseArray(lines, start, indent) : parseObject(lines, start, indent);
}

function parseArray(lines: ParsedLine[], start: number, indent: number): [YamlValue[], number] {
  const out: YamlValue[] = [];
  let i = start;

  while (i < lines.length) {
    const line = lines[i];
    if (line.indent < indent) break;
    if (line.indent !== indent || !line.text.startsWith("- ")) break;

    const rest = line.text.slice(2).trim();
    if (rest === "") {
      const [nested, next] = parseBlock(lines, i + 1, nextIndent(lines, i + 1, indent + 2));
      out.push(nested);
      i = next;
      continue;
    }

    // Quoted scalars and inline flow arrays are scalar items even when they
    // contain `:` — defer to parseScalar so quoted-colon strings survive.
    if (rest.startsWith('"') || rest.startsWith("'") || rest.startsWith("[")) {
      out.push(parseScalar(rest));
      i += 1;
      continue;
    }

    if (rest.includes(":")) {
      const obj: { [key: string]: YamlValue } = {};
      const [key, value] = parseKeyValue(rest);
      if (value === "") {
        const [nested, next] = parseBlock(lines, i + 1, nextIndent(lines, i + 1, indent + 2));
        obj[key] = nested;
        i = next;
      } else {
        obj[key] = parseScalar(value);
        i += 1;
      }

      if (i < lines.length && lines[i].indent > indent) {
        const [extra, next] = parseObject(lines, i, lines[i].indent);
        if (extra && !Array.isArray(extra) && typeof extra === "object") {
          Object.assign(obj, extra);
        }
        i = next;
      }
      out.push(obj);
      continue;
    }

    out.push(parseScalar(rest));
    i += 1;
  }

  return [out, i];
}

function parseObject(lines: ParsedLine[], start: number, indent: number): [Record<string, YamlValue>, number] {
  const out: Record<string, YamlValue> = {};
  let i = start;

  while (i < lines.length) {
    const line = lines[i];
    if (line.indent < indent) break;
    if (line.indent !== indent || line.text.startsWith("- ")) break;

    const [key, value] = parseKeyValue(line.text);
    if (value === "") {
      const childIndent = nextIndent(lines, i + 1, indent + 2);
      if (childIndent <= indent) {
        out[key] = {};
        i += 1;
      } else {
        const [nested, next] = parseBlock(lines, i + 1, childIndent);
        out[key] = nested;
        i = next;
      }
    } else {
      out[key] = parseScalar(value);
      i += 1;
    }
  }

  return [out, i];
}

function nextIndent(lines: ParsedLine[], start: number, fallback: number): number {
  return start < lines.length ? lines[start].indent : fallback;
}

export function parseSimpleYaml(input: string): Record<string, YamlValue> {
  const lines = cleanLines(input);
  if (lines.length === 0) return {};
  const [value, next] = parseBlock(lines, 0, lines[0].indent);
  if (next < lines.length) {
    throw new Error(`Could not parse YAML near: ${lines[next].text}`);
  }
  if (!value || Array.isArray(value) || typeof value !== "object") {
    throw new Error("Expected YAML document to be an object");
  }
  return value as Record<string, YamlValue>;
}

export type { YamlValue };

