#!/usr/bin/env python3
"""Adapte les URL SEO au domaine de votre hébergement, sans dépendances."""
from pathlib import Path
from urllib.parse import urlsplit
import json, sys
root = Path(__file__).resolve().parent
if len(sys.argv) != 2:
    raise SystemExit("Utilisation : python configurer-domaine.py https://votre-domaine.fr")
origin = sys.argv[1].rstrip('/')
u = urlsplit(origin)
if u.scheme != 'https' or not u.hostname or u.username or u.password or u.path or u.query or u.fragment or any(c.isspace() for c in origin):
    raise SystemExit("Indiquez une URL HTTPS à la racine, sans chemin : https://votre-domaine.fr")
config_path = root / 'domaine.json'
old = json.loads(config_path.read_text(encoding='utf-8'))['origin']
count = 0
for path in root.rglob('*'):
    if path.is_file() and path.suffix in {'.html', '.xml', '.txt', '.json', '.webmanifest'} and path.name not in {'LIRE-MOI.txt','domaine.json'}:
        text = path.read_text(encoding='utf-8')
        if old in text:
            path.write_text(text.replace(old, origin), encoding='utf-8')
            count += 1
config_path.write_text(json.dumps({'origin': origin}, indent=2) + '\n', encoding='utf-8')
print(f"Domaine configuré : {origin} ({count} fichiers actualisés).")
