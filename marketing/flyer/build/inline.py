#!/usr/bin/env python3
"""Inline {{asset:filename}} placeholders in a template HTML as base64 data URIs,
producing a standalone .html that renders under file:// and exports cleanly.

Usage: python3 inline.py <template.html> <output.html>
Mirrors the tabletent data-URI convention so the artwork is portable.
"""
import base64, re, sys, pathlib

MIME = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml"}

def data_uri(path: pathlib.Path) -> str:
    mime = MIME[path.suffix.lower()]
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{b64}"

def main(template, output):
    base = pathlib.Path(__file__).parent
    assets = base / "assets"
    html = pathlib.Path(template).read_text(encoding="utf-8")

    def repl(m):
        name = m.group(1).strip()
        path = assets / name
        if not path.exists():
            raise SystemExit(f"Missing asset: {path}")
        return data_uri(path)

    html = re.sub(r"\{\{asset:([^}]+)\}\}", repl, html)
    leftover = re.findall(r"\{\{asset:[^}]+\}\}", html)
    if leftover:
        raise SystemExit(f"Unresolved placeholders: {leftover}")
    pathlib.Path(output).write_text(html, encoding="utf-8")
    print(f"wrote {output} ({len(html)//1024} KB)")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
