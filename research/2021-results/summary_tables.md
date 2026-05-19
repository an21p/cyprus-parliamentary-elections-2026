# 2021 election — at-a-glance summary tables

Human-readable companion to the JSON files under [aggregated/](aggregated/).
Regenerate by re-running the verifiers; if the JSONs change and these tables
fall out of sync, the verifier scripts are authoritative.

All numbers in this file are produced by:

```
python3 verify_seats.py
python3 verify_results_ts.py
python3 compute_quotas_first_distribution.py
```

## 1. National vote share & seats

| Party (Greek) | PartyId | Votes | Share | Seats |
|---|---|---:|---:|---:|
| ΔΗΜΟΚΡΑΤΙΚΟΣ ΣΥΝΑΓΕΡΜΟΣ | DISY | 99,328 | 27.77 % | 17 |
| ΑΚΕΛ (ΑΝΟΡΘΩΤΙΚΟ ΚΟΜΜΑ ΕΡΓΑΖΟΜΕΝΟΥ ΛΑΟΥ) | AKEL | 79,913 | 22.34 % | 15 |
| ΔΗΜΟΚΡΑΤΙΚΟ ΚΟΜΜΑ | DIKO | 40,395 | 11.29 % | 9 |
| ΕΘΝΙΚΟ ΛΑΪΚΟ ΜΕΤΩΠΟ (Ε.ΛΑ.Μ.) | ELAM | 24,255 | 6.78 % | 4 |
| ΚΙΝΗΜΑ ΣΟΣΙΑΛΔΗΜΟΚΡΑΤΩΝ ΕΔΕΚ | EDEK | 24,022 | 6.72 % | 4 |
| ΔΗΜΟΚΡΑΤΙΚΗ ΠΑΡΑΤΑΞΗ | DIPA | 21,832 | 6.10 % | 4 |
| ΚΙΝΗΜΑ ΟΙΚΟΛΟΓΩΝ-ΣΥΝΕΡΓΑΣΙΑ ΠΟΛΙΤΩΝ | KOSP | 15,762 | 4.41 % | 3 |
| ΕΝΕΡΓΟΙ ΠΟΛΙΤΕΣ-ΚΙΝΗΜΑ ΕΝ.ΚΥΠ. ΚΥΝΗΓΩΝ | KEKK | 11,712 | 3.27 % | 0 (below 3.6 %) |
| **Qualifying total** | | **305,507** | **85.41 %** | **56** |
| sub-threshold + small lists | | 52,205 | 14.59 % | 0 |
| **Total valid votes** | | **357,712** | **100.00 %** | **56** |

The 3.6 % stage-2 threshold separates KOSP (3 seats) from KEKK (0 seats).
The MOI press release independently reports 357,712 valid votes —
[raw/results_summary.txt](raw/results_summary.txt) line 11.

## 2. Seats per party per district

| Party | NIC | LIM | FAM | LAR | PAF | KYR | **Total** |
|---|---:|---:|---:|---:|---:|---:|---:|
| DISY | 5 | 3 | 4 | 2 | 1 | 2 | **17** |
| AKEL | 6 | 3 | 3 | 1 | 1 | 1 | **15** |
| DIKO | 3 | 2 | 2 | 1 | 1 | 0 | **9** |
| ELAM | 1 | 1 | 1 | 1 | 0 | 0 | **4** |
| EDEK | 1 | 1 | 0 | 1 | 1 | 0 | **4** |
| DIPA | 2 | 1 | 1 | 0 | 0 | 0 | **4** |
| KOSP | 2 | 1 | 0 | 0 | 0 | 0 | **3** |
| **Total** | **20** | **12** | **11** | **6** | **4** | **3** | **56** |

Row totals: 17 + 15 + 9 + 4 + 4 + 4 + 3 = **56** ✓.
Column totals: 20 + 12 + 11 + 6 + 4 + 3 = **56** ✓.

## 3. First-stage Hare quotas

Computed as `floor(district_valid_votes / district_seats)`.

| District | Valid | Seats | Quota |
|---|---:|---:|---:|
| Nicosia (ΛΕΥΚΩΣΙΑ) | 122,347 | 20 | **6,117** |
| Limassol (ΛΕΜΕΣΟΣ) | 72,635 | 12 | **6,052** |
| Famagusta (ΑΜΜΟΧΩΣΤΟΣ) | 74,869 | 11 | **6,806** |
| Larnaca (ΛΑΡΝΑΚΑ) | 38,007 | 6 | **6,334** |
| Paphos (ΠΑΦΟΣ) | 32,298 | 4 | **8,074** |
| Kyrenia (ΚΕΡΥΝΕΙΑ) | 17,556 | 3 | **5,852** |

## 4. Nicosia stage-1 worked example

Quota = 122,347 ÷ 20 = **6,117**.

| Party | Votes | ÷ quota | Stage-1 seats | Unused remainder |
|---|---:|---:|---:|---:|
| DISY  | 31,163 | 5.094 | 5 | 578 |
| AKEL  | 25,770 | 4.213 | 4 | 1,302 |
| DIKO  | 13,449 | 2.198 | 2 | 1,215 |
| EDEK  | 9,061 | 1.481 | 1 | 2,944 |
| KOSP  | 8,386 | 1.371 | 1 | 2,269 |
| DIPA  | 8,232 | 1.346 | 1 | 2,115 |
| ELAM  | 7,486 | 1.224 | 1 | 1,369 |
| **Σ qualifying** | **103,547** | | **15** | **11,792** |

5 of Nicosia's 20 seats are left over after stage 1; they are filled from the
national pool (stages 2 and 3). The simulator's algorithm test reproduces
the exact final placement: AKEL +2, DIKO +1, KOSP +1, DIPA +1 — see
[tests/simulator.test.ts](../../tests/simulator.test.ts).

## 5. Stage-1 vs national-pool seats per district

| District | Seats | Stage 1 | Stages 2-3 |
|---|---:|---:|---:|
| Nicosia | 20 | 15 | 5 |
| Limassol | 12 | 6 | 6 |
| Famagusta | 11 | 5 | 6 |
| Larnaca | 6 | 2 | 4 |
| Paphos | 4 | 1 | 3 |
| Kyrenia | 3 | 0 | 3 |
| **Total** | **56** | **29** | **27** |

29 + 27 = **56** ✓. Nearly half of the chamber's seats (27 / 56 ≈ 48 %) come
from the national pool — the inter-district redistribution is not a small
correction, it is the system's central mechanism.

## 6. Source-of-truth chain

```
data.gov.cy/Parliamentary2021.csv ──► raw/parliamentary_2021.csv
                                       │  (verify_seats.py)
                                       ▼
                       aggregated/votes_per_party_per_district.json
                                       │  (verify_results_ts.py)
                                       ▼
sigmalive 31 May 2021 (archived) ──► raw/elected_mps_2021.json
                                       │  (verify_seats.py)
                                       ▼
                       aggregated/seats_per_party_per_district.json
                                       │  (verify_results_ts.py)
                                       ▼
                       src/lib/data/results-2021.ts ◄── (used by app)
                                       │  (compute_quotas_first_distribution.py)
                                       ▼
                       aggregated/quotas_first_distribution.json
                                       │  (tests/simulator.test.ts via vitest)
                                       ▼
                            historic 2021 outcome ✓
```

Each arrow is a script you can re-run; each script exits non-zero on any
discrepancy.
