<script lang="ts">
  import { PageShell, SectionBlock } from '$components/layout';

  let { data } = $props();
  const lang = $derived(data.lang);
  const currentPath = $derived(data.currentPath);

  type Source = { label: string; href: string };
  type SourceGroup = {
    titleEn: string;
    titleEl: string;
    items: Source[];
  };

  const SOURCE_GROUPS: SourceGroup[] = [
    {
      titleEn: 'Official Cyprus government',
      titleEl: 'Επίσημες πηγές κυβέρνησης Κύπρου',
      items: [
        { label: 'Central Elections Service: how to vote (gov.cy)', href: 'https://www.gov.cy/moi-elections/en/documents/parliamentary-elections-2026/how-to-vote/' },
        { label: 'Elections portal (elections.gov.cy)', href: 'https://elections.gov.cy/' },
        { label: 'Ministry of Interior: 2021 results portal', href: 'https://results.elections.moi.gov.cy/English/PARLIAMENTARY_ELECTIONS_2021/Islandwide' },
        { label: 'data.gov.cy: Official 2021 Parliamentary Election results (CSV / XLSX / JSON, polling-station level)', href: 'https://data.gov.cy/el/dataset/episima-apotelesmata-boyleytikon-eklogon-2021' }
      ]
    },
    {
      titleEn: 'Wikipedia',
      titleEl: 'Wikipedia',
      items: [
        { label: '2026 Cypriot legislative election', href: 'https://en.wikipedia.org/wiki/2026_Cypriot_legislative_election' },
        { label: '2021 Cypriot legislative election', href: 'https://en.wikipedia.org/wiki/2021_Cypriot_legislative_election' },
        { label: 'Elections in Cyprus', href: 'https://en.wikipedia.org/wiki/Elections_in_Cyprus' },
        { label: 'Direct Democracy Cyprus', href: 'https://en.wikipedia.org/wiki/Direct_Democracy_Cyprus' },
        { label: 'Fidias Panayiotou', href: 'https://en.wikipedia.org/wiki/Fidias_Panayiotou' }
      ]
    },
    {
      titleEn: 'OSCE / ODIHR & international',
      titleEl: 'ΟΑΣΕ / ODIHR & διεθνείς οργανισμοί',
      items: [
        { label: 'OSCE/ODIHR Cyprus 2021 final report', href: 'https://www.osce.org/odihr/elections/508379' },
        { label: 'OSCE/ODIHR Needs Assessment Mission report (2021)', href: 'https://www.osce.org/odihr/elections/cyprus/481552' },
        { label: 'International IDEA: Cyprus electoral system', href: 'https://www.idea.int/node/136610' },
        { label: 'IPU Parline: Cyprus', href: 'https://data.ipu.org/parliament/CY/CY-LC01/' },
        { label: 'Venice Commission: Allocation of Seats Inside the Lists', href: 'https://www.venice.coe.int/webforms/documents/default.aspx?pdffile=CDL(2015)016-e' }
      ]
    },
    {
      titleEn: 'Cyprus media',
      titleEl: 'Κυπριακά μέσα ενημέρωσης',
      items: [
        { label: 'Cyprus Mail: election coverage', href: 'https://cyprus-mail.com/2026/05/10/voters-to-choose-between-bewildering-array-of-parties' },
        { label: 'Politis EN: guide to contenders', href: 'https://en.politis.com.cy/politics/991519/a-guide-to-cyprus-parliamentary-contenders' },
        { label: 'Phileleftheros (philenews.com)', href: 'https://www.philenews.com/' },
        { label: 'SIGMA Live (EN)', href: 'https://en.sigmalive.com/parliamentary-elections-2026-what-to-expect/' },
        { label: 'Financial Mirror: record challengers', href: 'https://www.financialmirror.com/2026/05/07/record-challengers-for-cyprus-parliament/' }
      ]
    },
    {
      titleEn: 'Polling & academic analysis',
      titleEl: 'Δημοσκοπήσεις & ακαδημαϊκή ανάλυση',
      items: [
        { label: 'PolitPro: Cyprus dashboard & poll-of-polls', href: 'https://politpro.eu/en/cyprus' },
        { label: 'Europe Elects: Cyprus party guide', href: 'https://europeelects.eu/cyprus/' },
        { label: 'Sözen (2022), Cyprus: Political Developments and Data in 2021', href: 'https://onlinelibrary.wiley.com/doi/full/10.1111/2047-8852.12386' },
        { label: '"The Silent Electoral Earthquake in Cyprus" (Tandfonline)', href: 'https://www.tandfonline.com/doi/full/10.1080/13608746.2022.2034272' }
      ]
    }
  ];
</script>

<PageShell
  {lang}
  {currentPath}
  eyebrow={lang === 'el' ? 'Σχετικά' : 'About'}
  title={lang === 'el' ? 'Μεθοδολογία και πηγές' : 'Methodology & sources'}
  lede={lang === 'el'
    ? 'Πώς φτιάχτηκε αυτή η σελίδα, τι δεδομένα χρησιμοποιεί και πού να βρείτε τις πρωτογενείς πηγές.'
    : 'How this site was built, what data it uses, and where to find the underlying sources.'}
>
  <SectionBlock
    id="purpose"
    eyebrow={lang === 'el' ? 'Σκοπός' : 'Purpose'}
    title={lang === 'el' ? 'Γιατί υπάρχει αυτή η σελίδα' : 'Why this site exists'}
  >
    <p>
      {lang === 'el'
        ? 'Στόχος είναι να εξηγήσει στους πολίτες πώς οι ψήφοι μετατρέπονται σε έδρες στην Κύπρο, μια διαδικασία που, λόγω της τριπλής κατανομής και των ορίων, δεν είναι διαισθητική. Η σελίδα απευθύνεται σε ψηφοφόρους, δημοσιογράφους, ερευνητές και διεθνείς αναγνώστες που θέλουν να καταλάβουν τη μηχανική πίσω από τα αποτελέσματα της 24ης Μαΐου 2026.'
        : 'The aim is to help readers understand how votes are translated into seats in Cyprus, a process that is not intuitive because of the three-stage allocation and the various thresholds. The site is for voters, journalists, researchers and international readers who want to follow the mechanics behind the 24 May 2026 result.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Η σελίδα είναι μη κομματική. Δεν στηρίζει κανένα κόμμα ή υποψήφιο, δεν προβλέπει αποτελέσματα, και δεν αξιολογεί τις πολιτικές των κομμάτων.'
        : 'The site is non-partisan. It does not endorse any party or candidate, does not forecast results, and does not pass judgement on party platforms.'}
    </p>
  </SectionBlock>

  <SectionBlock
    id="data"
    eyebrow={lang === 'el' ? 'Δεδομένα' : 'Data'}
    title={lang === 'el' ? 'Τι δεδομένα χρησιμοποιεί' : 'What data it uses'}
  >
    <ul class="bare-list" role="list">
      <li>
        <strong>{lang === 'el' ? 'Δημοσκοπήσεις (§2.4)' : 'Polls (§2.4)'}:</strong>
        {lang === 'el'
          ? ' κάθε δημοσιευμένη δημοσκόπηση από τα τέλη 2024 έως τις 17 Μαΐου 2026.'
          : ' every published poll from late 2024 to 17 May 2026.'}
      </li>
      <li>
        <strong>{lang === 'el' ? 'Αποτελέσματα 2021 (§2.3)' : '2021 results (§2.3)'}:</strong>
        {lang === 'el'
          ? ' εθνικά και επαρχιακά νούμερα από το Υπουργείο Εσωτερικών.'
          : ' national and per-district totals from the Ministry of Interior.'}
      </li>
      <li>
        <strong>{lang === 'el' ? 'Εκλογικός νόμος (§1.6)' : 'Electoral law (§1.6)'}:</strong>
        {lang === 'el'
          ? ' η τριπλή κατανομή με όρια 3,6% και 7,2%.'
          : ' the three-stage allocation with 3.6% and 7.2% thresholds.'}
      </li>
      <li>
        <strong>{lang === 'el' ? 'Κατανομή εδρών ανά επαρχία (§1.2)' : 'District seat allocation (§1.2)'}:</strong>
        {lang === 'el'
          ? ' η κατανομή των 56 εδρών στις έξι επαρχίες (νόμος Οκτωβρίου 2025).'
          : ' the 56-seat distribution across the six districts (October 2025 law).'}
      </li>
      <li>
        <strong>{lang === 'el' ? 'Κατάλογος κομμάτων (§2.2)' : 'Party roster (§2.2)'}:</strong>
        {lang === 'el'
          ? ' οι 19 λίστες όπως κατατέθηκαν στον Έφορο Εκλογών στις 6 Μαΐου 2026.'
          : ' the 19 lists as filed with the Chief Returning Officer on 6 May 2026.'}
      </li>
    </ul>
  </SectionBlock>

  <SectionBlock
    id="caveats"
    eyebrow={lang === 'el' ? 'Επιφυλάξεις' : 'Caveats'}
    title={lang === 'el' ? 'Τι δεν κάνει αυτή η σελίδα' : 'What this site does not do'}
  >
    <ul class="bare-list" role="list">
      <li>{lang === 'el' ? 'Δεν προβλέπει αποτελέσματα: ο προσομοιωτής εκτελεί τον αλγόριθμο για τα ποσοστά που εσείς δίνετε, όχι μια πρόβλεψη.' : 'Does not predict results: the simulator runs the algorithm on the inputs you provide, not a forecast.'}</li>
      <li>{lang === 'el' ? 'Δεν στηρίζει κανένα κόμμα ή υποψήφιο.' : 'Does not endorse any party or candidate.'}</li>
      <li>{lang === 'el' ? 'Δεν περιλαμβάνει ζωντανά αποτελέσματα στην παρούσα έκδοση (v1).' : 'Does not include live election-night results in this version (v1).'}</li>
      <li>{lang === 'el' ? 'Δεν είναι επίσημη πηγή του κράτους ή του Υπουργείου Εσωτερικών.' : 'Is not an official Cypriot government or Ministry of Interior source.'}</li>
    </ul>
  </SectionBlock>

  <SectionBlock
    id="sources"
    eyebrow={lang === 'el' ? 'Πηγές' : 'Sources'}
    title={lang === 'el' ? 'Επίσημες και ανεξάρτητες πηγές' : 'Official and independent sources'}
  >
    <div class="sources-grid">
      {#each SOURCE_GROUPS as group (group.titleEn)}
        <section class="source-block">
          <h3 class="source-heading">{lang === 'el' ? group.titleEl : group.titleEn}</h3>
          <ul class="source-list" role="list">
            {#each group.items as item (item.href)}
              <li>
                <a class="source-link" href={item.href} rel="noopener noreferrer" target="_blank">{item.label}</a>
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    </div>
  </SectionBlock>

  <SectionBlock
    id="colophon"
    eyebrow={lang === 'el' ? 'Τεχνικά' : 'Colophon'}
    title={lang === 'el' ? 'Πώς φτιάχτηκε' : 'How it was built'}
  >
    <p>
      {lang === 'el'
        ? 'Η σελίδα είναι στατικό build με SvelteKit 5 (runes mode) και TypeScript. Δεν χρησιμοποιεί cookies, δεν φιλοξενεί διαφημίσεις και δεν παρακολουθεί τους επισκέπτες με analytics. Λειτουργεί σε δύο γλώσσες (Ελληνικά / English) και ο πηγαίος κώδικας είναι ανοιχτός. Όλος ο αλγόριθμος εκλογής εδρών εκτελείται στον περιηγητή σας.'
        : 'The site is a static build using SvelteKit 5 (runes mode) and TypeScript. It uses no cookies, runs no ads, and does not track visitors with analytics. It is bilingual (English / Greek) and the source code is open. The full seat-allocation algorithm runs locally in your browser.'}
    </p>
  </SectionBlock>
</PageShell>

<style>
  .bare-list {
    list-style: disc;
    margin: 0;
    padding-left: 1.2em;
    display: grid;
    gap: var(--sp-3);
    font-size: var(--fs-100);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
  }
  .bare-list strong {
    color: var(--color-ink);
    font-weight: 600;
  }

  .sources-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-6);
  }
  @media (min-width: 720px) {
    .sources-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .source-block { min-width: 0; }
  .source-heading {
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    margin: 0 0 var(--sp-3);
    font-weight: 600;
  }
  .source-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--sp-2);
  }
  .source-link {
    font-size: var(--fs-100);
    color: var(--color-ink-2);
    text-decoration: none;
    border-bottom: 1px solid var(--color-rule);
    transition: color var(--dur-fast) var(--ease-standard),
                border-color var(--dur-fast) var(--ease-standard);
  }
  .source-link:hover {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
  }
  .source-link:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
</style>
