---
description: Commit și push pe GitHub după aprobare explicită din partea utilizatorului
---

# github-push

Skill pentru a face commit și push pe GitHub. **Necesită aprobare explicită** înainte de push.

## Comportament

1. Rulează `git status` și `git diff` — arată ce s-a schimbat
2. **Cere confirmare** utilizatorului: „Vrei să fac push cu aceste modificări?"
3. Dacă primești OK → `git add`, `git commit`, `git push`
4. Dacă primești NU → se oprește fără nicio modificare la remote

**Nu face niciodată push fără aprobare explicită**, chiar dacă utilizatorul a aprobat anterior într-o altă sesiune.

## Flux standard

```bash
# 1. Vezi ce s-a schimbat
git status
git diff --stat

# 2. Arată utilizatorului și cere OK

# 3. Dacă OK:
git add presentation/generate_pptx.py
git add presentation/screenshots/
git add .claude/skills/
git commit -m "descriere scurtă a modificărilor"
git push origin dev
```

## Branch-uri

| Branch | Scop |
|---|---|
| `dev` | Branch curent de lucru |
| `main` | Branch principal — **nu push direct fără PR** |

Push-ul se face întotdeauna pe `dev`, nu pe `main`.

## Fișiere incluse de obicei la commit pentru prezentare

```
presentation/generate_pptx.py     ← scriptul de generare
presentation/Licenta-AutoMarketplace.pptx ← PPTX generat
presentation/screenshots/*.png    ← screenshot-uri actualizate
.claude/skills/*/SKILL.md          ← skill-uri actualizate
```

## Fișiere de exclus

```
__pycache__/
*.pyc
.env
node_modules/
```

Verifică `.gitignore` înainte de `git add .`.

## Mesaj de commit recomandat

Format: `tip: descriere scurtă în română sau engleză`

Exemple:
```
pptx: update slide 8 titlu nefuncționale → tehnice
pptx: adaugă screenshots full-width login/register
pptx: fix badge width slide 7 pentru ADMINISTRATOR
pptx: schimbă licență → diplomă în copertă
```

## Verificare după push

```bash
git log --oneline -5   # confirmă că commit-ul e acolo
git status             # working tree clean
```
