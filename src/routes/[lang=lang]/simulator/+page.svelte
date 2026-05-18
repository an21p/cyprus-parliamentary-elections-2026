<script lang="ts">
  import { PageShell, SectionBlock, Callout } from '$components/layout';
  import SimulatorInputs from '$lib/components/simulator/SimulatorInputs.svelte';
  import StageDistribution from '$lib/components/simulator/StageDistribution.svelte';
  import StageNationalPool from '$lib/components/simulator/StageNationalPool.svelte';
  import StageResidual from '$lib/components/simulator/StageResidual.svelte';
  import ResultsParliament from '$lib/components/simulator/ResultsParliament.svelte';
  import { simulatorState } from '$lib/simulator/state.svelte';
  import type { PartyId } from '$data/types';

  let { data } = $props();
  const lang = $derived(data.lang);
  const currentPath = $derived(data.currentPath);

  // National-share map used by the stage-2 threshold view.
  const nationalShareByParty = $derived.by<Map<PartyId, number>>(() => {
    const totalValid = simulatorState.allocation.totalValidVotes;
    const m = new Map<PartyId, number>();
    if (totalValid === 0) return m;
    // Sum each party's votes across districts (already computed inside
    // allocation.firstDistribution).
    const sums = new Map<PartyId, number>();
    for (const dist of simulatorState.allocation.firstDistribution) {
      for (const row of dist.perParty) {
        sums.set(row.partyId, (sums.get(row.partyId) ?? 0) + row.votes);
      }
    }
    for (const [pid, v] of sums.entries()) m.set(pid, (v / totalValid) * 100);
    return m;
  });
</script>

<PageShell
  {lang}
  {currentPath}
  eyebrow={lang === 'el' ? 'Διαδραστικός' : 'Interactive'}
  title={lang === 'el' ? 'Προσομοιωτής έδρας' : 'Seat allocation simulator'}
  lede={lang === 'el'
    ? 'Δώστε ποσοστά ψήφων σε κάθε κόμμα και δείτε πώς μετατρέπονται σε έδρες — και πού «χάνονται» ψήφοι.'
    : 'Set a vote share for each party and see how it translates into seats — and where votes get lost on the way.'}
>
  <SectionBlock
    id="inputs"
    eyebrow={lang === 'el' ? 'Είσοδος' : 'Inputs'}
    title={lang === 'el' ? 'Δώστε τα ποσοστά' : 'Set the vote shares'}
    lede={lang === 'el'
      ? 'Εθνικά ποσοστά μετατρέπονται σε ψήφους ανά επαρχία βάσει των περιφερειακών μοτίβων του 2021.'
      : 'National shares are projected into per-district vote totals using 2021 regional patterns.'}
  >
    <SimulatorInputs {lang} />

    <Callout tone="info">
      {lang === 'el'
        ? 'Πρόκειται για εκπαιδευτικό εργαλείο, όχι πρόβλεψη. Ο αλγόριθμος της κατανομής εδρών είναι ακριβής· η μετατροπή εθνικών ποσοστών σε ψήφους ανά επαρχία είναι προσέγγιση από τα δεδομένα του 2021 (πλήρη για Λευκωσία, Πάφο, Κερύνεια· εκτίμηση για Λεμεσό, Αμμόχωστο, Λάρνακα).'
        : 'Educational tool, not a forecast. The seat-allocation algorithm is exact; the upstream mapping of national shares into per-district votes is an approximation based on 2021 patterns (complete for Nicosia, Paphos, Kyrenia; estimated for Limassol, Famagusta, Larnaca).'}
    </Callout>
  </SectionBlock>

  <SectionBlock
    id="stage-1"
    eyebrow={lang === 'el' ? 'Φάση 1' : 'Stage 1'}
    title={lang === 'el' ? 'Πρώτη κατανομή ανά επαρχία' : 'First distribution per district'}
    lede={lang === 'el'
      ? 'Σε κάθε επαρχία υπολογίζεται εκλογικό μέτρο (Hare) και κατανέμονται έδρες σε όσα κόμματα το ξεπερνούν.'
      : 'Each district computes a Hare quota; parties win one seat per full quota and the leftover becomes "unused" votes.'}
  >
    <div class="dist-grid">
      {#each simulatorState.allocation.firstDistribution as trace (trace.districtId)}
        <StageDistribution {trace} {lang} />
      {/each}
    </div>
  </SectionBlock>

  <SectionBlock
    id="stage-2"
    eyebrow={lang === 'el' ? 'Φάση 2' : 'Stage 2'}
    title={lang === 'el' ? 'Εθνική δεξαμενή (όριο 3,6%)' : 'National pool (3.6 % threshold)'}
    lede={lang === 'el'
      ? 'Όσα κόμματα ξεπερνούν εθνικά το 3,6% μοιράζονται τις αχρησιμοποίητες ψήφους τους για να γεμίσουν τις υπόλοιπες έδρες.'
      : 'Parties above 3.6 % nationally pool their unused votes to fill the seats left vacant in stage 1.'}
  >
    <StageNationalPool
      trace={simulatorState.allocation.secondDistribution}
      {lang}
      nationalShare={nationalShareByParty}
    />
  </SectionBlock>

  <SectionBlock
    id="stage-3"
    eyebrow={lang === 'el' ? 'Φάση 3' : 'Stage 3'}
    title={lang === 'el' ? 'Υπόλοιπες έδρες (όριο 7,2%)' : 'Residual seats (7.2 % threshold)'}
  >
    <StageResidual
      trace={simulatorState.allocation.thirdDistribution}
      {lang}
    />
  </SectionBlock>

  <SectionBlock
    id="parliament"
    eyebrow={lang === 'el' ? 'Αποτέλεσμα' : 'Result'}
    title={lang === 'el' ? 'Η Βουλή που θα προέκυπτε' : 'The parliament this would produce'}
  >
    <ResultsParliament result={simulatorState.allocation} {lang} />
  </SectionBlock>
</PageShell>

<style>
  .dist-grid {
    display: grid;
    gap: var(--sp-4);
    grid-template-columns: 1fr;
  }
  @media (min-width: 640px) {
    .dist-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (min-width: 1024px) {
    .dist-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
