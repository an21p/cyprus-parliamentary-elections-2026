#!/usr/bin/env python3
"""
Compute the **first-stage** seat allocation of the 2021 Cypriot parliamentary
election from cached source data, for use as the auditable paper trail behind
the Nicosia walkthrough on the explainer site.

Cyprus uses three-stage "reinforced proportional representation":

  Stage 1: in each district, party allotment = floor(party_votes / quota),
           where quota = floor(district_valid_votes / district_seats) (Hare).
           Unused = party_votes - allotment * quota.
  Stage 2: round-robin national pool, only for parties >= 3.6 % nationally.
  Stage 3: sequential residual pool, only for parties >= 7.2 % nationally.

This script reproduces stage 1 exactly (the stages 2-3 routine is the
simulator's responsibility — see `src/lib/election-algorithm.ts`).

Run from this directory: `python3 compute_quotas_first_distribution.py`.
Writes `aggregated/quotas_first_distribution.json`; exits non-zero on any
internal inconsistency.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
AGG = ROOT / "aggregated"

DISTRICT_ORDER = ["ΛΕΥΚΩΣΙΑ", "ΛΕΜΕΣΟΣ", "ΑΜΜΟΧΩΣΤΟΣ", "ΛΑΡΝΑΚΑ", "ΠΑΦΟΣ", "ΚΕΡΥΝΕΙΑ"]
DISTRICT_SEATS_2021 = {
    "ΛΕΥΚΩΣΙΑ": 20, "ΛΕΜΕΣΟΣ": 12, "ΑΜΜΟΧΩΣΤΟΣ": 11,
    "ΛΑΡΝΑΚΑ": 6, "ΠΑΦΟΣ": 4, "ΚΕΡΥΝΕΙΑ": 3,
}
DISTRICT_ID_SHORT = {
    "ΛΕΥΚΩΣΙΑ": "NIC", "ΛΕΜΕΣΟΣ": "LIM", "ΑΜΜΟΧΩΣΤΟΣ": "FAM",
    "ΛΑΡΝΑΚΑ": "LAR", "ΠΑΦΟΣ": "PAF", "ΚΕΡΥΝΕΙΑ": "KYR",
}


def check(condition: bool, message: str, failures: list[str]) -> None:
    status = "✓" if condition else "✗"
    print(f"  {status} {message}")
    if not condition:
        failures.append(message)


def main() -> int:
    votes_path = AGG / "votes_per_party_per_district.json"
    seats_path = AGG / "seats_per_party_per_district.json"
    if not votes_path.exists() or not seats_path.exists():
        print("Run verify_seats.py first to generate aggregated/ JSONs.", file=sys.stderr)
        return 2

    votes_data = json.loads(votes_path.read_text(encoding="utf-8"))
    seats_data = json.loads(seats_path.read_text(encoding="utf-8"))
    district_totals = votes_data["district_totals"]
    seats_by_name = {p["name"]: p for p in seats_data["parties"]}

    failures: list[str] = []
    out: dict[str, dict] = {}

    print("Hare quotas per district (floor(valid / seats))")
    quotas: dict[str, int] = {}
    for d in DISTRICT_ORDER:
        seats = DISTRICT_SEATS_2021[d]
        valid = district_totals[d]
        q = valid // seats
        quotas[d] = q
        print(f"  {d:<11} valid={valid:>7,}  seats={seats:>2}  quota={q:>6,}")

    print("\nFirst-distribution allotments + unused remainders")
    for d in DISTRICT_ORDER:
        q = quotas[d]
        seats = DISTRICT_SEATS_2021[d]
        per_party_out = []
        first_dist_total = 0
        # Iterate parties in vote-share order (already sorted in votes JSON).
        for p_entry in votes_data["parties"]:
            v = p_entry["per_district"][d]
            allot = v // q if q > 0 else 0
            unused = v - allot * q
            first_dist_total += allot
            qualifying = p_entry["name"] in seats_by_name
            final_seats = seats_by_name.get(p_entry["name"], {}).get("per_district", {}).get(d, 0)
            per_party_out.append({
                "party": p_entry["name"],
                "votes": v,
                "first_distribution_seats": allot,
                "unused_votes": unused,
                "final_seats": final_seats,
                "reallocated_seats": final_seats - allot,
                "qualifying_nationally": qualifying,
            })

        out[d] = {
            "district_id_short": DISTRICT_ID_SHORT[d],
            "valid_votes": district_totals[d],
            "seats": seats,
            "hare_quota": q,
            "first_distribution_total": first_dist_total,
            "seats_left_for_national_pool": seats - first_dist_total,
            "parties": per_party_out,
        }
        leftover = seats - first_dist_total
        check(0 <= leftover <= seats,
              f"{d}: stage-1 filled {first_dist_total}/{seats}, "
              f"{leftover} carried to stages 2-3",
              failures)

        # Cross-check: every qualifying party's final_seats == allotment +
        # reallocation must be >= allotment (the national pool can only ADD
        # seats; stage-1 allotments are never reduced).
        for row in per_party_out:
            if row["qualifying_nationally"]:
                check(row["final_seats"] >= row["first_distribution_seats"],
                      f"{d} {row['party'][:32]}: final ({row['final_seats']}) >= stage-1 ({row['first_distribution_seats']})",
                      failures)

    print("\nSeats reallocated via the national pool, by district")
    grand_realloc = 0
    for d in DISTRICT_ORDER:
        r = out[d]["seats_left_for_national_pool"]
        grand_realloc += r
        print(f"  {d:<11} +{r} seat(s)")
    print(f"  TOTAL                   +{grand_realloc} (= seats decided by stages 2-3 nationally)")

    # The 56 seats break down as: (sum of stage-1 allotments) + (national-pool reallocations).
    grand_stage1 = sum(out[d]["first_distribution_total"] for d in DISTRICT_ORDER)
    check(grand_stage1 + grand_realloc == 56,
          f"56 = stage-1 ({grand_stage1}) + national pool ({grand_realloc})",
          failures)

    payload = {
        "election": "Cyprus parliamentary 2021",
        "election_date": "2021-05-30",
        "source": [
            "research/2021-results/aggregated/votes_per_party_per_district.json",
            "research/2021-results/aggregated/seats_per_party_per_district.json",
        ],
        "method": (
            "Hare quota = floor(district_valid_votes / district_seats). "
            "First-distribution seats per party = floor(party_district_votes / quota). "
            "Unused votes per party = party_district_votes - allotment * quota."
        ),
        "stage_2_threshold_pct": 3.6,
        "stage_3_threshold_pct": 7.2,
        "by_district": out,
        "grand_total": {
            "stage_1_seats": grand_stage1,
            "national_pool_seats": grand_realloc,
            "all_seats": grand_stage1 + grand_realloc,
        },
    }
    out_path = AGG / "quotas_first_distribution.json"
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {out_path.relative_to(ROOT)}")

    if failures:
        print(f"\n{len(failures)} verification failures", file=sys.stderr)
        return 1
    print("\nAll checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
