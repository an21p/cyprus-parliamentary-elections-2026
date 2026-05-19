#!/usr/bin/env python3
"""
Cross-check the production data file `src/lib/data/results-2021.ts` against
the locally-cached aggregates produced by `verify_seats.py`.

`verify_seats.py` builds the paper trail from the raw MOI CSV + the
elected-MP roster. This script closes the last link: it parses the
TypeScript constant the simulator actually loads at runtime and asserts
that every (district, party) votes-and-seats cell matches the aggregates.

Run from this directory: `python3 verify_results_ts.py`.
Exits non-zero on any mismatch.
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
AGG = ROOT / "aggregated"
TS_FILE = ROOT.parents[1] / "src" / "lib" / "data" / "results-2021.ts"

# Mapping from the simulator's PartyId enum to the canonical Greek party
# name used in the MOI CSV (and in the aggregated JSON).
PARTY_ID_TO_GREEK = {
    "DISY": "ΔΗΜΟΚΡΑΤΙΚΟΣ ΣΥΝΑΓΕΡΜΟΣ",
    "AKEL": "ΑΚΕΛ (ΑΝΟΡΘΩΤΙΚΟ ΚΟΜΜΑ ΕΡΓΑΖΟΜΕΝΟΥ ΛΑΟΥ)",
    "DIKO": "ΔΗΜΟΚΡΑΤΙΚΟ ΚΟΜΜΑ",
    "ELAM": "ΕΘΝΙΚΟ ΛΑΪΚΟ ΜΕΤΩΠΟ (Ε.ΛΑ.Μ.)",
    "EDEK": "ΚΙΝΗΜΑ ΣΟΣΙΑΛΔΗΜΟΚΡΑΤΩΝ ΕΔΕΚ",
    "DIPA": "ΔΗΜΟΚΡΑΤΙΚΗ ΠΑΡΑΤΑΞΗ",
    "KOSP": "ΚΙΝΗΜΑ ΟΙΚΟΛΟΓΩΝ-ΣΥΝΕΡΓΑΣΙΑ ΠΟΛΙΤΩΝ",
    "KEKK": "ΕΝΕΡΓΟΙ ΠΟΛΙΤΕΣ-ΚΙΝΗΜΑ ΕΝ.ΚΥΠ. ΚΥΝΗΓΩΝ",
}
DISTRICT_ID_TO_GREEK = {
    "NIC": "ΛΕΥΚΩΣΙΑ",
    "LIM": "ΛΕΜΕΣΟΣ",
    "FAM": "ΑΜΜΟΧΩΣΤΟΣ",
    "LAR": "ΛΑΡΝΑΚΑ",
    "PAF": "ΠΑΦΟΣ",
    "KYR": "ΚΕΡΥΝΕΙΑ",
}

# A `Result2021Entry` block in the TS file looks like:
#
#   { partyId: 'DISY', nationalVotes: 99328, nationalShare: 27.77, totalSeats: 17,
#     perDistrict: {
#       NIC: { votes: 31163, seats: 5 }, LIM: { votes: 20733, seats: 3 }, ... }}
#
# Python's stdlib `re` can't balance nested braces, so we slice the file
# into per-party chunks and run flat regexes inside each chunk.
PARTY_HEADER_RX = re.compile(r"partyId:\s*'(?P<pid>[A-Z]+)'")
NV_RX = re.compile(r"nationalVotes:\s*(?P<nv>\d+)")
TS_RX = re.compile(r"totalSeats:\s*(?P<ts>\d+)")
CELL_RX = re.compile(
    r"(?P<did>NIC|LIM|FAM|LAR|PAF|KYR):\s*\{\s*"
    r"votes:\s*(?P<v>\d+)\s*,\s*seats:\s*(?P<s>\d+)\s*\}"
)


def parse_results_ts() -> dict[str, dict]:
    text = TS_FILE.read_text(encoding="utf-8")
    headers = list(PARTY_HEADER_RX.finditer(text))
    out: dict[str, dict] = {}
    for idx, m in enumerate(headers):
        pid = m.group("pid")
        start = m.start()
        end = headers[idx + 1].start() if idx + 1 < len(headers) else len(text)
        chunk = text[start:end]
        nv_m = NV_RX.search(chunk)
        ts_m = TS_RX.search(chunk)
        cells: dict[str, dict[str, int]] = {}
        for c in CELL_RX.finditer(chunk):
            cells[c.group("did")] = {"votes": int(c.group("v")), "seats": int(c.group("s"))}
        out[pid] = {
            "national_votes": int(nv_m.group("nv")) if nv_m else None,
            "total_seats": int(ts_m.group("ts")) if ts_m else None,
            "per_district": cells,
        }
    return out


def check(condition: bool, message: str, failures: list[str]) -> None:
    status = "✓" if condition else "✗"
    print(f"  {status} {message}")
    if not condition:
        failures.append(message)


def main() -> int:
    ts_entries = parse_results_ts()
    votes = json.loads((AGG / "votes_per_party_per_district.json").read_text(encoding="utf-8"))
    seats = json.loads((AGG / "seats_per_party_per_district.json").read_text(encoding="utf-8"))
    votes_by_name = {p["name"]: p for p in votes["parties"]}
    seats_by_name = {p["name"]: p for p in seats["parties"]}

    failures: list[str] = []

    print("Party-ID coverage")
    expected_ids = set(PARTY_ID_TO_GREEK)
    parsed_ids = set(ts_entries)
    check(parsed_ids == expected_ids,
          f"parsed PartyIds {sorted(parsed_ids)} == expected {sorted(expected_ids)}",
          failures)

    print("\nPer-party cell match (votes-and-seats) vs aggregated JSON")
    reconciled: dict[str, dict] = {}
    for pid, entry in ts_entries.items():
        greek = PARTY_ID_TO_GREEK[pid]
        v_entry = votes_by_name.get(greek)
        s_entry = seats_by_name.get(greek)
        check(v_entry is not None, f"{pid} ({greek}) present in votes JSON", failures)
        check(entry["national_votes"] == (v_entry["national_votes"] if v_entry else None),
              f"{pid} national_votes {entry['national_votes']:,}", failures)
        # KEKK is below the 3.6% threshold and has zero seats: it does NOT
        # appear in seats_per_party_per_district.json (which lists only the
        # qualifying parties that won seats).
        if pid != "KEKK":
            check(s_entry is not None, f"{pid} present in seats JSON", failures)
            check(entry["total_seats"] == (s_entry["total_seats"] if s_entry else None),
                  f"{pid} total_seats {entry['total_seats']}", failures)
        else:
            check(s_entry is None, "KEKK correctly absent from seats JSON (sub-threshold)", failures)
            check(entry["total_seats"] == 0, "KEKK total_seats == 0 in TS file", failures)

        cells_ok = True
        for did_short, did_greek in DISTRICT_ID_TO_GREEK.items():
            ts_cell = entry["per_district"].get(did_short)
            agg_votes = v_entry["per_district"].get(did_greek) if v_entry else None
            agg_seats = s_entry["per_district"].get(did_greek, 0) if s_entry else 0
            if ts_cell is None or ts_cell["votes"] != agg_votes or ts_cell["seats"] != agg_seats:
                cells_ok = False
                failures.append(
                    f"{pid} @ {did_short}: TS={ts_cell} vs agg(votes={agg_votes}, seats={agg_seats})"
                )
        check(cells_ok, f"{pid} all 6 district cells match", failures)
        reconciled[pid] = {
            "greek_name": greek,
            "national_votes": entry["national_votes"],
            "total_seats": entry["total_seats"],
            "per_district": entry["per_district"],
        }

    out_path = AGG / "reconciliation_results_ts.json"
    out_path.write_text(json.dumps({
        "source_ts_file": str(TS_FILE.relative_to(ROOT.parents[1])),
        "compared_against": [
            str((AGG / "votes_per_party_per_district.json").relative_to(ROOT)),
            str((AGG / "seats_per_party_per_district.json").relative_to(ROOT)),
        ],
        "party_id_to_greek": PARTY_ID_TO_GREEK,
        "district_id_to_greek": DISTRICT_ID_TO_GREEK,
        "reconciled": reconciled,
        "failures": failures,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {out_path.relative_to(ROOT)}")

    if failures:
        print(f"\n{len(failures)} verification failures", file=sys.stderr)
        return 1
    print("\nAll checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
