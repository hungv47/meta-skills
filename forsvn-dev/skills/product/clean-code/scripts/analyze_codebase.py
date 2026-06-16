#!/usr/bin/env python3
"""
Analyze a codebase directory and identify cleanup opportunities.

Usage:
    python analyze_codebase.py [directory]
    python analyze_codebase.py                  # analyzes current working directory
    python analyze_codebase.py /path/to/project  # analyzes the given directory

Output:
    - Human-readable report printed to stdout
    - JSON report written to <directory>/cleanup_report.json

Supported languages:
    Python, JavaScript, TypeScript, JSX, TSX, Vue, Svelte,
    Ruby, Go, Rust, Java, Kotlin, Swift, C, C++, C/C++ headers (.h)

What gets flagged:
    - Junk files (.DS_Store, Thumbs.db, *.pyc, *.swp, *.bak, etc.)
    - Empty directories
    - Large directories (>20 files) that may need splitting
    - Potentially unused code files (not imported by any other file
      and not recognized as an entry point, test, or config file)
    - Unused assets (images, fonts, media not referenced in any source file)
    - Broken/empty assets (0-byte files, likely corrupt files)
    - Duplicate assets (identical content at different paths, via SHA-256)
    - Test files in production paths (*.test.*, fixtures in public/)

Limitations:
    - Static analysis only; does not execute code
    - Import analysis only works for JS-family (JS, TS, JSX, TSX, Vue,
      Svelte) and Python; other listed languages are scanned for
      junk/unused but imports are not traced, so "potentially unused"
      results are unreliable for those languages
    - May flag files loaded via dynamic imports, barrel/index re-exports,
      or monorepo workspace aliases (e.g., @myapp/utils)
    - Asset reference detection uses filename matching; CMS-managed or
      dynamically constructed asset paths will cause false positives
    - No test coverage analysis
    - Import resolution limited to relative paths (not bare specifiers)
"""

import os
import re
import json
import sys
import hashlib
from pathlib import Path
from collections import defaultdict
from typing import Set, Dict, List

# Directories to skip entirely during traversal (build artifacts, caches, vendored deps)
IGNORE_DIRS = {
    'node_modules', '.git', '__pycache__', '.next', 'dist', 'build', 
    'venv', '.venv', 'env', '.env', 'coverage', '.nyc_output', '.cache',
    '.idea', '.vscode', 'vendor', 'target'
}

# Exact filenames always considered junk and safe to delete
JUNK_FILES = {
    '.DS_Store', 'Thumbs.db', 'desktop.ini', '.gitkeep', '.keep'
}

# Regex patterns matched against filenames to detect junk (compiled bytecode, swap files, backups)
JUNK_PATTERNS = [
    r'.*\.pyc$', r'.*\.pyo$', r'.*\.swp$', r'.*\.swo$', 
    r'.*~$', r'.*\.bak$', r'.*\.backup$', r'.*\.log$',
    r'.*\.orig$', r'.*\.tmp$'
]

# File extensions recognized as source code for import analysis and unused-file detection
CODE_EXTENSIONS = {
    '.py', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
    '.rb', '.go', '.rs', '.java', '.kt', '.swift', '.c', '.cpp', '.h'
}

# File extensions recognized as assets (images, fonts, media, documents)
ASSET_EXTENSIONS = {
    # Images
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif', '.ico', '.bmp', '.tiff',
    # Fonts
    '.woff', '.woff2', '.ttf', '.eot', '.otf',
    # Media
    '.mp4', '.webm', '.mp3', '.ogg', '.wav',
    # Documents
    '.pdf',
}

# Extensions to search for asset references (source + templates + stylesheets + configs)
REFERENCE_EXTENSIONS = {
    '.py', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
    '.rb', '.go', '.rs', '.java', '.kt', '.swift',
    '.html', '.htm', '.ejs', '.erb', '.hbs', '.pug', '.njk', '.jinja', '.jinja2',
    '.css', '.scss', '.sass', '.less', '.styl',
    '.md', '.mdx',
    '.json', '.yaml', '.yml', '.toml',
}

# Directories that ship to production (test files here are problems)
PRODUCTION_DIRS = {'public', 'static', 'assets', 'dist', 'build', 'out', '_next'}

# Test file patterns
TEST_PATTERNS = [
    r'.*\.test\..*$', r'.*\.spec\..*$', r'.*_test\..*$', r'.*_spec\..*$',
    r'.*\.stories\..*$', r'.*\.story\..*$',
]

# Test directories
TEST_DIRS = {'__tests__', '__mocks__', '__fixtures__', '__snapshots__', 'fixtures', 'mocks'}

# Dev-only files that shouldn't be in production dirs
DEV_ONLY_FILES = {
    '.env.example', '.env.local.example', '.env.sample',
    'docker-compose.yml', 'docker-compose.yaml', 'Dockerfile',
    'Makefile', 'Vagrantfile', 'Procfile',
}


def should_ignore(path: Path) -> bool:
    """Check if path should be ignored."""
    parts = path.parts
    return any(part in IGNORE_DIRS for part in parts)


def is_junk_file(filename: str) -> bool:
    """Check if file is junk."""
    if filename in JUNK_FILES:
        return True
    return any(re.match(p, filename) for p in JUNK_PATTERNS)


def extract_imports_js(content: str) -> Set[str]:
    """Extract imports from JS/TS files."""
    imports = set()
    patterns = [
        r'import\s+.*?\s+from\s+[\'"](.+?)[\'"]',
        r'import\s+[\'"](.+?)[\'"]',
        r'require\s*\(\s*[\'"](.+?)[\'"]\s*\)',
        r'import\s*\(\s*[\'"](.+?)[\'"]\s*\)',
    ]
    for pattern in patterns:
        imports.update(re.findall(pattern, content))
    return imports


def extract_imports_py(content: str) -> Set[str]:
    """Extract imports from Python files."""
    imports = set()
    patterns = [
        r'^import\s+(\S+)',
        r'^from\s+(\S+)\s+import',
    ]
    for pattern in patterns:
        imports.update(re.findall(pattern, content, re.MULTILINE))
    return imports


def resolve_import(import_path: str, source_file: Path, root: Path) -> Path | None:
    """Try to resolve an import to a file path."""
    if import_path.startswith('.'):
        base = source_file.parent
        parts = import_path.split('/')
        for part in parts:
            if part == '.':
                continue
            elif part == '..':
                base = base.parent
            else:
                base = base / part
        
        for ext in ['', '.ts', '.tsx', '.js', '.jsx', '.py', '/index.ts', '/index.tsx', '/index.js']:
            candidate = base.with_suffix(ext) if ext.startswith('.') else Path(str(base) + ext)
            if candidate.exists():
                return candidate
    return None


def file_hash(path: Path) -> str | None:
    """Compute SHA-256 hash of a file's contents."""
    try:
        h = hashlib.sha256()
        with open(path, 'rb') as f:
            for chunk in iter(lambda: f.read(8192), b''):
                h.update(chunk)
        return h.hexdigest()
    except Exception:
        return None


def is_test_file(filename: str) -> bool:
    """Check if a file matches test file patterns."""
    return any(re.match(p, filename, re.IGNORECASE) for p in TEST_PATTERNS)


def is_in_production_dir(rel_path: str) -> bool:
    """Check if a file is inside a directory that ships to production."""
    parts = Path(rel_path).parts
    return any(part in PRODUCTION_DIRS for part in parts)


def is_in_test_dir(rel_path: str) -> bool:
    """Check if a file is inside a test directory."""
    parts = Path(rel_path).parts
    return any(part in TEST_DIRS for part in parts)


def find_asset_references(root: Path, all_source_files: List[Path], asset_filename: str) -> List[str]:
    """Search all source files for references to an asset filename.

    Uses full filename as primary match. Falls back to stem (without extension)
    only if the stem is 4+ characters to avoid false positives from short names
    like 'a.png' (stem 'a' would match everything).
    """
    references = []
    stem = Path(asset_filename).stem
    # Full filename always searched; stem only if long enough to be meaningful
    patterns = [asset_filename]
    if len(stem) >= 4:
        patterns.append(stem)

    for source_file in all_source_files:
        try:
            content = source_file.read_text(errors='ignore')
            for pattern in patterns:
                if pattern in content:
                    references.append(str(source_file.relative_to(root)))
                    break
        except Exception:
            pass
    return references


def analyze_assets(root: Path, all_source_files: List[Path] | None = None) -> Dict:
    """Analyze asset files for waste patterns.

    Args:
        root: Project root directory.
        all_source_files: Pre-collected source files for reference checking.
            If None, collects them via a separate walk (slower).

    Note: Files inside IGNORE_DIRS (dist, build, .next) are skipped entirely,
    which means test files nested inside build output subdirectories won't be
    detected. This is a known limitation — the tradeoff avoids massive false
    positives from generated files.
    """
    asset_report = {
        'total_assets': 0,
        'total_asset_size': 0,
        'broken_empty': [],      # 0-byte or likely corrupt files
        'test_in_prod': [],      # Test files in production directories
        'unused_assets': [],     # Assets with zero references in source
        'duplicate_assets': [],  # Identical content at different paths
        'unoptimized': [],       # Large images that should use modern formats
    }

    # Collect source files if not provided by caller
    if all_source_files is None:
        all_source_files = []
        for dirpath, dirnames, filenames in os.walk(root):
            path = Path(dirpath)
            if should_ignore(path):
                dirnames.clear()
                continue
            dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
            for filename in filenames:
                file_path = path / filename
                ext = file_path.suffix.lower()
                if ext in REFERENCE_EXTENSIONS:
                    all_source_files.append(file_path)

    # Collect asset files, detect broken/unoptimized in single pass
    asset_files: List[Dict] = []       # only non-broken assets (eligible for unused check)
    broken_paths: Set[str] = set()     # track broken assets to exclude from unused scan
    hash_to_paths: Dict[str, List[Dict]] = defaultdict(list)

    for dirpath, dirnames, filenames in os.walk(root):
        path = Path(dirpath)
        if should_ignore(path):
            dirnames.clear()
            continue
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]

        for filename in filenames:
            file_path = path / filename
            ext = file_path.suffix.lower()
            rel_path = str(file_path.relative_to(root))

            # Check for test files in production paths (any file type)
            if is_in_production_dir(rel_path):
                if is_test_file(filename) or is_in_test_dir(rel_path) or filename in DEV_ONLY_FILES:
                    try:
                        size = file_path.stat().st_size
                    except Exception:
                        size = 0
                    asset_report['test_in_prod'].append({
                        'path': rel_path,
                        'size': size,
                        'reason': 'test/dev file in production directory',
                    })

            # Empty CSS / stub JS detection in production dirs
            if ext in {'.css', '.js'} and is_in_production_dir(rel_path):
                try:
                    size = file_path.stat().st_size
                    if size == 0:
                        asset_report['broken_empty'].append({
                            'path': rel_path,
                            'size': 0,
                            'issue': f'0-byte {ext} file in production path',
                        })
                    elif ext == '.css' and size < 200:
                        content = file_path.read_text(errors='ignore').strip()
                        # Strip comments and @charset — if nothing remains, it's empty
                        stripped = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL).strip()
                        stripped = re.sub(r'@charset\s+[^;]+;', '', stripped).strip()
                        if not stripped:
                            asset_report['broken_empty'].append({
                                'path': rel_path,
                                'size': size,
                                'issue': 'CSS file with no rule declarations (only comments/charset)',
                            })
                    elif ext == '.js' and size < 50:
                        content = file_path.read_text(errors='ignore').strip()
                        if not any(kw in content for kw in ('function', 'class', 'export', 'module', '=>', 'const', 'let', 'var')):
                            asset_report['broken_empty'].append({
                                'path': rel_path,
                                'size': size,
                                'issue': f'stub JS file ({size} bytes, no exports or functions)',
                            })
                except Exception:
                    pass

            if ext not in ASSET_EXTENSIONS:
                continue

            try:
                size = file_path.stat().st_size
            except Exception:
                continue

            asset_report['total_assets'] += 1
            asset_report['total_asset_size'] += size

            asset_info = {
                'path': rel_path,
                'size': size,
                'ext': ext,
                'filename': filename,
            }

            # Broken/empty detection — check BEFORE adding to asset_files
            is_broken = False

            if size == 0:
                asset_report['broken_empty'].append({
                    'path': rel_path,
                    'size': 0,
                    'issue': '0-byte file (broken or failed conversion)',
                })
                broken_paths.add(rel_path)
                is_broken = True

            elif ext in {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.bmp', '.tiff'} and size < 100 and size not in (67, 68):
                asset_report['broken_empty'].append({
                    'path': rel_path,
                    'size': size,
                    'issue': f'suspiciously small image ({size} bytes, likely corrupt)',
                })
                broken_paths.add(rel_path)
                is_broken = True

            if is_broken:
                continue  # don't add to asset_files, hash, or unoptimized

            # Non-broken asset — eligible for unused/duplicate/unoptimized checks
            asset_files.append(asset_info)

            # Hash for duplicate detection
            h = file_hash(file_path)
            if h:
                hash_to_paths[h].append(asset_info)

            # Unoptimized media detection
            if ext == '.png' and size > 200_000:
                asset_report['unoptimized'].append({
                    'path': rel_path,
                    'size': size,
                    'issue': f'PNG > 200KB ({size // 1024}KB) — consider WebP/AVIF for ~60-80% savings',
                })
            elif ext in {'.bmp', '.tiff'}:
                asset_report['unoptimized'].append({
                    'path': rel_path,
                    'size': size,
                    'issue': f'{ext} should never be served on the web — convert to WebP/PNG',
                })
            elif ext == '.gif' and size > 500_000:
                asset_report['unoptimized'].append({
                    'path': rel_path,
                    'size': size,
                    'issue': f'GIF > 500KB ({size // 1024}KB) — consider MP4/WebM for animations',
                })
            elif ext == '.ico' and size > 100_000:
                asset_report['unoptimized'].append({
                    'path': rel_path,
                    'size': size,
                    'issue': f'favicon {size // 1024}KB — oversized (should be <100KB)',
                })

    # Duplicate detection (identical content at different paths)
    for h, paths in hash_to_paths.items():
        if len(paths) > 1:
            total = sum(p['size'] for p in paths)
            saveable = total - paths[0]['size']  # keep one, save the rest
            asset_report['duplicate_assets'].append({
                'files': [p['path'] for p in paths],
                'size_each': paths[0]['size'],
                'combined_size': total,
                'saveable': saveable,
            })

    # Unused asset detection (check if any source file references the asset)
    for asset in asset_files:
        refs = find_asset_references(root, all_source_files, asset['filename'])
        if not refs:
            asset_report['unused_assets'].append({
                'path': asset['path'],
                'size': asset['size'],
                'type': asset['ext'],
                'evidence': 'zero references found in source files',
            })

    # Sort by size descending for prioritization
    asset_report['unused_assets'].sort(key=lambda x: x['size'], reverse=True)
    asset_report['unoptimized'].sort(key=lambda x: x['size'], reverse=True)

    return asset_report


def analyze_directory(root: Path) -> Dict:
    """Analyze a directory and return cleanup report."""
    report = {
        'total_files': 0,
        'code_files': 0,
        'junk_files': [],
        'empty_dirs': [],
        'large_dirs': [],
        'potentially_unused': [],
        'file_tree': defaultdict(list),
        'imports_graph': defaultdict(set),
        'imported_by': defaultdict(set),
    }
    
    all_code_files = set()
    all_reference_files: List[Path] = []  # broader set for asset reference checking

    for dirpath, dirnames, filenames in os.walk(root):
        path = Path(dirpath)

        if should_ignore(path):
            dirnames.clear()
            continue

        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]

        if not filenames and not dirnames:
            rel_path = path.relative_to(root)
            report['empty_dirs'].append(str(rel_path))
            continue

        if len(filenames) > 20:
            rel_path = path.relative_to(root)
            report['large_dirs'].append({
                'path': str(rel_path),
                'file_count': len(filenames)
            })

        for filename in filenames:
            report['total_files'] += 1
            file_path = path / filename
            rel_path = file_path.relative_to(root)

            if is_junk_file(filename):
                report['junk_files'].append(str(rel_path))
                continue

            ext = file_path.suffix.lower()

            # Collect reference files for asset scanning (broader than code files)
            if ext in REFERENCE_EXTENSIONS:
                all_reference_files.append(file_path)

            if ext in CODE_EXTENSIONS:
                report['code_files'] += 1
                all_code_files.add(str(rel_path))
                
                try:
                    content = file_path.read_text(errors='ignore')
                    
                    if ext in {'.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte'}:
                        imports = extract_imports_js(content)
                    elif ext == '.py':
                        imports = extract_imports_py(content)
                    else:
                        imports = set()
                    
                    for imp in imports:
                        resolved = resolve_import(imp, file_path, root)
                        if resolved:
                            resolved_rel = str(resolved.relative_to(root))
                            report['imports_graph'][str(rel_path)].add(resolved_rel)
                            report['imported_by'][resolved_rel].add(str(rel_path))
                except Exception:
                    pass
            
            parent_dir = str(path.relative_to(root))
            report['file_tree'][parent_dir].append(filename)
    
    for code_file in all_code_files:
        is_entry = any(p in code_file.lower() for p in ['index.', 'main.', 'app.', 'server.', '__init__'])
        is_test = any(p in code_file.lower() for p in ['test', 'spec', '__test__', '.test.', '.spec.'])
        is_config = any(p in code_file.lower() for p in ['config', 'settings', '.d.ts'])
        
        if not is_entry and not is_test and not is_config:
            if code_file not in report['imported_by']:
                report['potentially_unused'].append(code_file)
    
    report['imports_graph'] = {k: list(v) for k, v in report['imports_graph'].items()}
    report['imported_by'] = {k: list(v) for k, v in report['imported_by'].items()}

    # Asset analysis — pass collected reference files to avoid redundant tree walk
    report['assets'] = analyze_assets(root, all_source_files=all_reference_files)

    return report


def print_report(report: Dict):
    """Print a human-readable report."""
    print("=" * 60)
    print("CODEBASE ANALYSIS REPORT")
    print("=" * 60)
    
    print(f"\n## Overview")
    print(f"Total files: {report['total_files']}")
    print(f"Code files: {report['code_files']}")
    
    if report['junk_files']:
        print(f"\n## Junk Files ({len(report['junk_files'])} files)")
        print("Safe to delete:")
        for f in report['junk_files'][:20]:
            print(f"  - {f}")
        if len(report['junk_files']) > 20:
            print(f"  ... and {len(report['junk_files']) - 20} more")
    
    if report['empty_dirs']:
        print(f"\n## Empty Directories ({len(report['empty_dirs'])})")
        print("Safe to delete:")
        for d in report['empty_dirs'][:10]:
            print(f"  - {d}/")
        if len(report['empty_dirs']) > 10:
            print(f"  ... and {len(report['empty_dirs']) - 10} more")
    
    if report['large_dirs']:
        print(f"\n## Large Directories (>20 files)")
        print("Consider splitting:")
        for d in report['large_dirs']:
            print(f"  - {d['path']}/ ({d['file_count']} files)")
    
    if report['potentially_unused']:
        print(f"\n## Potentially Unused Files ({len(report['potentially_unused'])})")
        print("Verify before removing (may be dynamically imported):")
        for f in report['potentially_unused'][:20]:
            print(f"  - {f}")
        if len(report['potentially_unused']) > 20:
            print(f"  ... and {len(report['potentially_unused']) - 20} more")

    # Asset analysis results
    assets = report.get('assets', {})
    if assets:
        def fmt_size(b):
            if b >= 1_048_576:
                return f"{b / 1_048_576:.1f}MB"
            if b >= 1024:
                return f"{b / 1024:.1f}KB"
            return f"{b}B"

        print(f"\n{'=' * 60}")
        print("ASSET ANALYSIS")
        print(f"{'=' * 60}")
        print(f"\nTotal assets: {assets.get('total_assets', 0)}")
        print(f"Total asset size: {fmt_size(assets.get('total_asset_size', 0))}")

        broken = assets.get('broken_empty', [])
        if broken:
            print(f"\n## Broken/Empty Assets — CRITICAL ({len(broken)})")
            for item in broken[:15]:
                print(f"  - {item['path']} ({fmt_size(item['size'])}) — {item['issue']}")
            if len(broken) > 15:
                print(f"  ... and {len(broken) - 15} more")

        test_in_prod = assets.get('test_in_prod', [])
        if test_in_prod:
            total_size = sum(t['size'] for t in test_in_prod)
            print(f"\n## Test/Dev Files in Production Paths — CRITICAL ({len(test_in_prod)}, {fmt_size(total_size)})")
            for item in test_in_prod[:15]:
                print(f"  - {item['path']} ({fmt_size(item['size'])})")
            if len(test_in_prod) > 15:
                print(f"  ... and {len(test_in_prod) - 15} more")

        unused = assets.get('unused_assets', [])
        if unused:
            total_size = sum(u['size'] for u in unused)
            print(f"\n## Unused Assets ({len(unused)}, {fmt_size(total_size)} total)")
            print("Verify before removing (may be CMS-managed or dynamically referenced):")
            for item in unused[:20]:
                print(f"  - {item['path']} ({fmt_size(item['size'])}) [{item['type']}]")
            if len(unused) > 20:
                print(f"  ... and {len(unused) - 20} more")

        dupes = assets.get('duplicate_assets', [])
        if dupes:
            total_saveable = sum(d['saveable'] for d in dupes)
            print(f"\n## Duplicate Assets ({len(dupes)} sets, {fmt_size(total_saveable)} saveable)")
            for item in dupes[:10]:
                print(f"  - {', '.join(item['files'])} ({fmt_size(item['size_each'])} each)")
            if len(dupes) > 10:
                print(f"  ... and {len(dupes) - 10} more sets")

        unoptimized = assets.get('unoptimized', [])
        if unoptimized:
            print(f"\n## Unoptimized Media ({len(unoptimized)})")
            for item in unoptimized[:15]:
                print(f"  - {item['path']} ({fmt_size(item['size'])}) — {item['issue']}")
            if len(unoptimized) > 15:
                print(f"  ... and {len(unoptimized) - 15} more")

    print("\n" + "=" * 60)


def main():
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    
    if not root.exists():
        print(f"Error: {root} does not exist")
        sys.exit(1)
    
    report = analyze_directory(root)
    print_report(report)
    
    json_path = root / 'cleanup_report.json'
    with open(json_path, 'w') as f:
        json.dump(report, f, indent=2)
    print(f"\nDetailed report saved to: {json_path}")


if __name__ == '__main__':
    main()
