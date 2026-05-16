// Shared CLI arg parser. Tracks presence vs. value separately to avoid the
// `--notes "--something"` and `--notes ""` collapses the old per-file parser had.

export type Args = Record<string, string | boolean>;

export function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

export function strArg(args: Args, key: string): string | null {
  const v = args[key];
  return typeof v === "string" ? v : null;
}

export function boolArg(args: Args, key: string): boolean {
  return args[key] === true || typeof args[key] === "string";
}

// Multi-occurrence string arg, e.g. --artifact foo --artifact bar.
// Tracks presence in raw argv since parseArgs collapses repeats.
export function multiStrArg(argv: string[], key: string): string[] {
  const flag = `--${key}`;
  const out: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === flag && argv[i + 1] && !argv[i + 1].startsWith("--")) {
      out.push(argv[++i]);
    }
  }
  return out;
}
