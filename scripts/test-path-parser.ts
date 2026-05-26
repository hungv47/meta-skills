#!/usr/bin/env bun
// test-path-parser — unit tests for scripts/lib/path-parser.ts.
//
// Covers the flat v2 filename grammar, legacy nested paths, loop / experience /
// canonical exceptions, and buildFlatPath validation. Run from the repo root:
//
//   bun scripts/test-path-parser.ts   (exits 0 on pass, 1 on fail)

import { parseArtifactPath, buildFlatPath, isFlatPath, htmlTwinPath } from "./lib/path-parser";

type Case = { name: string; run: () => void };

const cases: Case[] = [
  {
    name: "flat v2 path — md",
    run: () => {
      const p = parseArtifactPath(".forsvn/artifacts/mkt-create-brand-2026-05-26-forsvn-pure-void.md");
      assertEq(p.shape, "flat");
      assertEq(p.stack, "mkt");
      assertEq(p.skill, "create-brand");
      assertEq(p.date, "2026-05-26");
      assertEq(p.slug, "forsvn-pure-void");
      assertEq(p.extension, "md");
    },
  },
  {
    name: "flat v2 path — html twin",
    run: () => {
      const p = parseArtifactPath(".forsvn/artifacts/product-map-user-flow-2026-05-26-checkout.html");
      assertEq(p.shape, "flat");
      assertEq(p.stack, "product");
      assertEq(p.skill, "map-user-flow");
      assertEq(p.extension, "html");
    },
  },
  {
    name: "legacy nested path with date prefix",
    run: () => {
      const p = parseArtifactPath(".forsvn/artifacts/meta/records/2026-05-26-fresh-eyes-routing.md");
      assertEq(p.shape, "legacy");
      assertEq(p.stack, "meta");
      assertEq(p.date, "2026-05-26");
      assertEq(p.slug, "fresh-eyes-routing");
    },
  },
  {
    name: "legacy nested path without date prefix",
    run: () => {
      const p = parseArtifactPath(".forsvn/artifacts/meta/specs/desktop-pricing.md");
      assertEq(p.shape, "legacy");
      assertEq(p.stack, "meta");
      assertEq(p.slug, "desktop-pricing");
    },
  },
  {
    name: "loop workspace path",
    run: () => {
      const p = parseArtifactPath(".forsvn/loops/pricing-page/program.md");
      assertEq(p.shape, "loop");
    },
  },
  {
    name: "experience domain file",
    run: () => {
      const p = parseArtifactPath(".forsvn/experience/audience.md");
      assertEq(p.shape, "experience");
    },
  },
  {
    name: "canonical top-level brand path",
    run: () => {
      const p = parseArtifactPath("brand/BRAND.md");
      assertEq(p.shape, "canonical-top");
    },
  },
  {
    name: "unknown path",
    run: () => {
      const p = parseArtifactPath("README.md");
      assertEq(p.shape, "unknown");
    },
  },
  {
    name: "buildFlatPath happy path",
    run: () => {
      const got = buildFlatPath({ stack: "mkt", skill: "create-brand", date: "2026-05-26", slug: "Forsvn Pure Void" });
      assertEq(got, ".forsvn/artifacts/mkt-create-brand-2026-05-26-forsvn-pure-void.md");
    },
  },
  {
    name: "buildFlatPath rejects bad stack",
    run: () => {
      assertThrows(() => buildFlatPath({ stack: "ops", skill: "x", date: "2026-05-26", slug: "y" }));
    },
  },
  {
    name: "buildFlatPath rejects bad date",
    run: () => {
      assertThrows(() => buildFlatPath({ stack: "meta", skill: "x", date: "2026/05/26", slug: "y" }));
    },
  },
  {
    name: "buildFlatPath round-trips through parser",
    run: () => {
      const built = buildFlatPath({ stack: "product", skill: "architect-system", date: "2026-05-26", slug: "conquis-desktop" });
      const parsed = parseArtifactPath(built);
      assertEq(parsed.shape, "flat");
      assertEq(parsed.stack, "product");
      assertEq(parsed.skill, "architect-system");
      assertEq(parsed.slug, "conquis-desktop");
    },
  },
  {
    name: "isFlatPath truthiness",
    run: () => {
      assertEq(isFlatPath(".forsvn/artifacts/meta-discover-2026-05-13-desktop-pricing.md"), true);
      assertEq(isFlatPath(".forsvn/artifacts/meta/specs/desktop-pricing.md"), false);
      assertEq(isFlatPath("research/icp-research.md"), false);
    },
  },
  {
    name: "htmlTwinPath swaps extension",
    run: () => {
      assertEq(
        htmlTwinPath(".forsvn/artifacts/mkt-create-brand-2026-05-26-x.md"),
        ".forsvn/artifacts/mkt-create-brand-2026-05-26-x.html",
      );
    },
  },
];

let failed = 0;
for (const c of cases) {
  try {
    c.run();
    console.log(`  ok  ${c.name}`);
  } catch (err) {
    failed++;
    console.error(`  FAIL  ${c.name}\n        ${(err as Error).message}`);
  }
}
console.log(`\n${cases.length - failed}/${cases.length} passed`);
process.exit(failed === 0 ? 0 : 1);

function assertEq<T>(got: T, expected: T): void {
  const a = JSON.stringify(got);
  const b = JSON.stringify(expected);
  if (a !== b) throw new Error(`expected ${b}, got ${a}`);
}

function assertThrows(fn: () => unknown): void {
  try {
    fn();
  } catch {
    return;
  }
  throw new Error("expected function to throw");
}
