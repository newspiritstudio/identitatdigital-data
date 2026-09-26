# Dades d'Identitat.digital

Conjunt de dades estructurades d'[Identitat.digital](https://identitat.digital):
les fitxes de privadesa de les aplicacions, les empreses que les operen, les
fonts que sostenen cada afirmació, els incidents de seguretat, les taxonomies
i la metodologia de puntuació.

Totes les revisions i la metodologia vigent (versió 1.1) són del 22 de
setembre de 2026.

## Estructura

Un fitxer JSON per entitat, amb el `slug` com a nom de fitxer.

| Carpeta o fitxer | Contingut |
| --- | --- |
| `aplicacions/` | 426 fitxes d'aplicacions i serveis |
| `empreses/` | 442 empreses i grups |
| `fonts/` | 1.664 fonts documentals (polítiques, resolucions, anàlisis, premsa) |
| `incidents/` | 141 filtracions, sancions i incidents |
| `taxonomies/categories.json` | Categories funcionals |
| `taxonomies/tipus-de-dades.json` | Tipus de dades personals i la seva sensibilitat |
| `taxonomies/finalitats.json` | Finalitats del tractament |
| `metodologia.json` | Dimensions, indicadors, pesos i principis de la puntuació |
| `tipus.ts` | Definició TypeScript de l'estructura de cada entitat |
| `scripts/valida.mjs` | Comprovació de coherència |

Les relacions es fan per `slug`: una aplicació apunta a la seva empresa
(`company`), a les seves categories i als tipus de dades i finalitats de la
matriu de recollida; cada afirmació apunta a les fonts que la sostenen
(`sources`); els incidents apunten a aplicacions i empreses.

### Afirmacions amb evidència

Els camps que es puntuen són afirmacions amb aquesta forma:

```json
{
  "status": "yes",
  "level": "official",
  "sources": ["whatsapp-privacy-policy"],
  "detail": "Explicació breu de l'afirmació.",
  "verifiedAt": "2026-09-22"
}
```

- `status`: `yes`, `partial`, `no`, `unknown` (no s'ha pogut documentar) o
  `na` (no aplica al servei).
- `level`: nivell de la font, de més a menys fort: `official`, `regulator`,
  `independent`, `press`, `editorial` (interpretació pròpia) o `unknown`.

A la matriu `dataCollection`, `status` pren els valors `yes`, `optional`, `no`
o `unknown`.

Les puntuacions no hi són: es calculen a partir d'aquestes afirmacions amb la
metodologia de `metodologia.json`.

## Validació

Amb Node 20 o posterior, sense instal·lar res:

```sh
node scripts/valida.mjs
```

Comprova que cada fitxer es diu com el seu slug, que no hi ha slugs repetits,
que totes les referències existeixen i que els estats i nivells d'evidència
són vàlids.

## Origen

Les dades s'exporten del projecte `identitatdigital` amb:

```sh
pnpm export-data ../identitatdigital-data
```

L'exportació reescriu les carpetes d'entitats senceres. Si s'edita una fitxa
aquí, cal portar el canvi també al projecte, o es perdrà a la següent
exportació.

## Llicència

CC BY-SA 4.0. Vegeu [LICENSE.md](LICENSE.md).
