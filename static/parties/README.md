# Party logos — 2026 Cyprus parliamentary election

Logos for the 20 parties tracked in `src/lib/data/parties.ts`. Filename is the lowercased party id, so `disy.svg` matches party id `DISY`.

## Asset inventory

| Id | File | Format | Dimensions | Source |
|----|------|--------|-----------:|--------|
| DISY | `disy.svg` | SVG | vector | en.wikipedia.org infobox — `Logo_of_the_Democratic_Rally_(Cyprus).svg` |
| AKEL | `akel.svg` | SVG | vector | en.wikipedia.org infobox — `Logo_of_the_Progressive_Party_of_Working_People.svg` |
| DIKO | `diko.svg` | SVG | vector | en.wikipedia.org infobox — `Logo_of_the_Democratic_Party_(Cyprus).svg` |
| ELAM | `elam.png` | PNG | 170×215 | en.wikipedia.org infobox — `ELAM_(Cyprus)_Logo.png` |
| EDEK | `edek.png` | PNG | 318×314 | en.wikipedia.org infobox — `Movement_for_Social_Democracy_logo.png` |
| DIPA | `dipa.png` | PNG | 316×316 | en.wikipedia.org infobox — `Democratic_Front_(Cyprus)_logo.png` (DIPA = former Democratic Front; this is the current logo) |
| KOSP | `kosp.svg` | SVG | vector | en.wikipedia.org infobox — `Logo_of_the_Movement_of_Ecologists_—_Citizens'_Cooperation.svg` |
| ALMA | `alma.png` | PNG | 367×272 | en.wikipedia.org infobox — `Logo_of_the_ALMA_–_Citizens_for_Cyprus.png` |
| ADK | `adk.jpg` | JPEG | 357×141 | el.wikipedia.org infobox — `Άμεση_Δημοκρατία_Κύπρου.jpg` |
| VOLT | `volt.svg` | SVG | vector | commons.wikimedia.org — `Logo_of_Volt.svg` (canonical pan-European mark used by Volt Cyprus) |
| DEK | `dek.png` | PNG | 871×201 | Official site — `dekcyprus.com` |
| DIMAL | `dimal.webp` | WebP | n/a | Official site — `demal.cy` |
| KEKK | `kekk.png` | PNG | 908×115 | Official site — `cyprushunters.com.cy` |
| LAKE | `lake.jpg` | JPEG | 856×204 | Official blog — `pamelakedemonioi.blogspot.com` (header emblem) |
| SIKOU | `sikou.png` | PNG | 1280×1094 | Official site — `sikoupanw.com` |
| AGRO | `agro.svg` | SVG | vector | Official site — `agronomos.org.cy` |
| GRNC | `grnc.png` | PNG | 512×512 | Official site — `greenpartycyprus.org` |
| FARL | _missing_ | — | — | No party website or social-media-hosted logo found |
| POPSF | _missing_ | — | — | Single-candidate Limassol-only party; no public visual identity |
| AKEL "Social Alliance" rebrand | _not separate_ | — | — | akel.org.cy uses the standard `akel.svg` across all Social Alliance pages; no distinct logo exists |

## Gaps and follow-ups

- **FARL** (Far-Left Resistance – Communism) — communications run through Celestina De Petro's personal Facebook; no logo asset surfaced. Render with text/initials placeholder until the party publishes one.
- **POPSF** (Popular Struggle for Freedom) — appears only on the Returning Officer's candidate manifest; no website, no social accounts. Same placeholder treatment.
- **DEK, DIMAL, KEKK** are wide horizontal banner logotypes (logo + text on one strip), unlike the roughly square Wikipedia logos. UI should accommodate the wider aspect ratio or crop to the mark.
- **DIMAL** is WebP; convert to PNG if any target surface (e.g. social meta previews) doesn't render WebP reliably.
- **ELAM, ADK, LAKE** are lower-resolution rasters. If a higher-res version is needed later, the parties' Facebook profile pictures are the next likely source.

## Provenance and use

All logos are the marks of the respective political parties, fetched from the parties' own sites or from Wikipedia/Wikimedia infoboxes. They are stored here for use in this elections information site, in the same informational/editorial context as Wikipedia or news outlets that display them. They are not relicensed; rights remain with each party.
