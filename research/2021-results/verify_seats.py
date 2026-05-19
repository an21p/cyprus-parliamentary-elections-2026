#!/usr/bin/env python3
"""
Verify the 2021 seats-per-party-per-district tally used by this project.

Reads only files cached locally in raw/ (no network) and:
  1. Aggregates the ballot-box CSV to (district, party) → votes.
  2. Counts the elected-MP roster to (district, party) → seats.
  3. Cross-checks district totals against the seat allotments
     (Nicosia 20, Limassol 12, Famagusta 11, Larnaca 6, Paphos 4, Kyrenia 3 = 56).
  4. Writes aggregated/{votes,seats}_per_party_per_district.json.

Run from this directory: `python3 verify_seats.py`.
Exits non-zero if any check fails.
"""
from __future__ import annotations
import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"
AGG = ROOT / "aggregated"
AGG.mkdir(exist_ok=True)

DISTRICT_ORDER = ["ΛΕΥΚΩΣΙΑ", "ΛΕΜΕΣΟΣ", "ΑΜΜΟΧΩΣΤΟΣ", "ΛΑΡΝΑΚΑ", "ΠΑΦΟΣ", "ΚΕΡΥΝΕΙΑ"]
DISTRICT_SEATS = {
    "ΛΕΥΚΩΣΙΑ": 20,
    "ΛΕΜΕΣΟΣ": 12,
    "ΑΜΜΟΧΩΣΤΟΣ": 11,
    "ΛΑΡΝΑΚΑ": 6,
    "ΠΑΦΟΣ": 4,
    "ΚΕΡΥΝΕΙΑ": 3,
}
ASSERT_TOTAL_SEATS = 56


def aggregate_votes() -> tuple[dict[str, dict[str, int]], dict[str, int], dict[str, int]]:
    votes: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    district_totals: dict[str, int] = defaultdict(int)
    party_totals: dict[str, int] = defaultdict(int)
    with (RAW / "parliamentary_2021.csv").open(encoding="utf-8") as f:
        for row in csv.DictReader(f):
            d = row["ELECTION_DISTRICT"].strip()
            p = row["PARTY"].strip()
            v = int(row["VOTES"])
            votes[d][p] += v
            district_totals[d] += v
            party_totals[p] += v
    return votes, district_totals, party_totals


def tally_seats() -> dict[str, dict[str, int]]:
    data = json.loads((RAW / "elected_mps_2021.json").read_text(encoding="utf-8"))
    seats: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for mp in data["elected"]:
        seats[mp["district"]][mp["party"]] += 1
    return seats


def check(condition: bool, message: str, failures: list[str]) -> None:
    status = "✓" if condition else "✗"
    print(f"  {status} {message}")
    if not condition:
        failures.append(message)


def main() -> int:
    votes, district_totals, party_totals = aggregate_votes()
    seats = tally_seats()

    failures: list[str] = []

    print("District seat allotments")
    grand = 0
    for d in DISTRICT_ORDER:
        got = sum(seats[d].values())
        expected = DISTRICT_SEATS[d]
        grand += got
        check(got == expected, f"{d}: {got} seats (expected {expected})", failures)
    check(grand == ASSERT_TOTAL_SEATS, f"grand total {grand} seats == {ASSERT_TOTAL_SEATS}", failures)

    print("\nVote totals (sanity)")
    total_valid = sum(party_totals.values())
    check(total_valid > 0, f"non-empty CSV (total valid votes = {total_valid:,})", failures)
    # The MOI press release reports 357,712 valid votes; the CSV omits a small
    # number of disputed/late-validated ballots, so allow a tolerance band.
    check(355_000 <= total_valid <= 360_000,
          f"total valid votes within MOI-published band (355k–360k): {total_valid:,}",
          failures)

    print("\nWriting aggregated JSON")
    parties_sorted = sorted(party_totals.items(), key=lambda kv: kv[1], reverse=True)

    votes_out = {
        "election": "Cyprus parliamentary 2021",
        "election_date": "2021-05-30",
        "source": "data.gov.cy/sites/default/files/Parliamentary2021.csv (cached in raw/)",
        "districts": DISTRICT_ORDER,
        "total_valid_votes": total_valid,
        "district_totals": {d: district_totals[d] for d in DISTRICT_ORDER},
        "parties": [
            {
                "name": p,
                "national_votes": party_totals[p],
                "per_district": {d: votes[d].get(p, 0) for d in DISTRICT_ORDER},
            }
            for p, _ in parties_sorted
        ],
    }
    (AGG / "votes_per_party_per_district.json").write_text(
        json.dumps(votes_out, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("  wrote aggregated/votes_per_party_per_district.json")

    seats_party_order = sorted(
        {p for d in seats for p in seats[d]},
        key=lambda p: -sum(seats[d].get(p, 0) for d in DISTRICT_ORDER),
    )
    seats_out = {
        "election": "Cyprus parliamentary 2021",
        "election_date": "2021-05-30",
        "source": "raw/elected_mps_2021.json (parsed from sigmalive 2021-05-31 article)",
        "districts": DISTRICT_ORDER,
        "district_seats": DISTRICT_SEATS,
        "total_seats": ASSERT_TOTAL_SEATS,
        "parties": [
            {
                "name": p,
                "total_seats": sum(seats[d].get(p, 0) for d in DISTRICT_ORDER),
                "per_district": {d: seats[d].get(p, 0) for d in DISTRICT_ORDER},
            }
            for p in seats_party_order
        ],
    }
    (AGG / "seats_per_party_per_district.json").write_text(
        json.dumps(seats_out, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("  wrote aggregated/seats_per_party_per_district.json")

    print("\nSeats per party per district")
    header = f"{'PARTY':<55} " + " ".join(f"{d[:7]:>7}" for d in DISTRICT_ORDER) + "  TOTAL"
    print(header)
    print("-" * len(header))
    for entry in seats_out["parties"]:
        row = f"{entry['name'][:55]:<55} "
        for d in DISTRICT_ORDER:
            row += f"{entry['per_district'][d]:>7} "
        row += f"  {entry['total_seats']:>4}"
        print(row)

    if failures:
        print(f"\n{len(failures)} verification failures", file=sys.stderr)
        return 1
    print("\nAll checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
