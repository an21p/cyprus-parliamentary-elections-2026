<script lang="ts">
  import { base } from '$app/paths';
  import { PageShell, SectionBlock, Callout, KMath } from '$components/layout';
  import { WorkedExampleStep } from '$lib/components/walkthrough';

  let { data } = $props();
  const lang = $derived(data.lang);
  const currentPath = $derived(data.currentPath);

  // Numbers straight from the Ministry of Interior worked example
  // (gov.cy / moi-elections / eklogiko-systima / "Παράδειγμα").
  const PARTIES = [
    { label: 'Α’', unused: 30000, stage2: 5, stage2Rem: 2500,  stage3: 0 },
    { label: 'Β’', unused: 22000, stage2: 4, stage2Rem: 0,     stage3: 0 },
    { label: 'Γ’', unused: 20000, stage2: 3, stage2Rem: 3500,  stage3: 1 },
    { label: 'Δ’', unused: 15000, stage2: 2, stage2Rem: 4000,  stage3: 1 },
    { label: 'Ε’', unused: 12000, stage2: 2, stage2Rem: 1000,  stage3: 0 }
  ];
  const TOTAL_UNUSED = 99000;
  const REMAINING_SEATS = 18;
  const STAGE2_QUOTA = 5500;
  const STAGE2_TOTAL = 16; // 5+4+3+2+2
  const STAGE3_TOTAL = 2;
</script>

<PageShell
  {lang}
  {currentPath}
  numeral="20.2"
  eyebrow={lang === 'el' ? 'Παράδειγμα 2' : 'Walkthrough · Example 2'}
  title={lang === 'el'
    ? 'Παράδειγμα Υπ. Εσωτερικών — δεύτερη & τρίτη κατανομή'
    : 'MOI worked example — second & third distribution'}
  lede={lang === 'el'
    ? 'Το επίσημο παράδειγμα του Υπουργείου Εσωτερικών για το πώς υπολογίζεται το εκλογικό μέτρο της δεύτερης κατανομής και πώς μοιράζονται οι αδιάθετες έδρες.'
    : 'The Ministry of Interior\'s own walkthrough of how the second-stage electoral quota is computed and how residual seats are awarded.'}
>
  <SectionBlock
    id="intro"
    eyebrow={lang === 'el' ? 'Εισαγωγή' : 'Intro'}
    title={lang === 'el' ? 'Γιατί αυτό το παράδειγμα' : 'Why this example'}
  >
    <p>
      {#if lang === 'el'}
        Σε αντίθεση με το <a class="inline-link" href={`${base}/${lang}/worked-example`}>Παράδειγμα 1 (Λευκωσία 2021)</a>, που χρησιμοποιεί πραγματικά δεδομένα, αυτό το παράδειγμα προέρχεται από την <strong>επίσημη ιστοσελίδα του Υπουργείου Εσωτερικών</strong>: είναι ένα υποθετικό σενάριο με <strong>πέντε κόμματα</strong> και <strong>18 αδιάθετες έδρες</strong>, σχεδιασμένο για να δείχνει με καθαρή αριθμητική <em>πώς υπολογίζεται το εκλογικό μέτρο</em> της δεύτερης κατανομής και <em>πώς απονέμονται οι υπολειπόμενες έδρες</em> στην τρίτη κατανομή.
      {:else}
        Unlike <a class="inline-link" href={`${base}/${lang}/worked-example`}>Example 1 (Nicosia 2021)</a>, which uses real data, this example comes from the <strong>Ministry of Interior's own page</strong>: a hypothetical setup with <strong>five qualifying parties</strong> and <strong>18 unallocated seats</strong>, designed to show with clean numbers <em>how the second-stage electoral quota is computed</em> and <em>how residual seats are awarded</em> in the third distribution.
      {/if}
    </p>
    <Callout
      tone="fact"
      title={lang === 'el' ? 'Πηγή' : 'Source'}
      label={lang === 'el' ? 'gov.cy' : 'gov.cy'}
    >
      <p>
        <a
          class="inline-link"
          href="https://www.gov.cy/moi-elections/documents/voyleytikes-plirofories/eklogiko-systima/"
          target="_blank"
          rel="noopener noreferrer"
        >
          gov.cy/moi-elections — Εκλογικό Σύστημα
        </a>
      </p>
    </Callout>
  </SectionBlock>

  <SectionBlock
    id="setup"
    eyebrow={lang === 'el' ? 'Το σενάριο' : 'The setup'}
    title={lang === 'el' ? 'Πέντε κόμματα, 18 αδιάθετες έδρες' : 'Five parties, 18 unallocated seats'}
  >
    <p>
      {#if lang === 'el'}
        Στην πρώτη κατανομή έχουν ήδη δοθεί κάποιες έδρες ανά επαρχία. Πέντε κομματικοί συνδυασμοί <strong>έχουν περάσει το όριο του 3,6%</strong> και διεκδικούν τις <strong>{REMAINING_SEATS} αδιάθετες έδρες</strong>. Καθένας μπαίνει στη δεύτερη κατανομή με τα εξής <strong>αχρησιμοποίητα υπόλοιπα</strong> από την πρώτη κατανομή:
      {:else}
        After the first distribution, some seats have already been awarded per district. Five party lists have <strong>cleared the 3.6 % threshold</strong> and now compete for the <strong>{REMAINING_SEATS} unallocated seats</strong>. Each enters the second distribution with these <strong>stage-1 unused remainders</strong>:
      {/if}
    </p>

    <div class="party-table">
      <div class="party-table-head">
        <span>{lang === 'el' ? 'Κόμμα' : 'Party'}</span>
        <span class="num">{lang === 'el' ? 'Αχρησιμ. υπόλοιπο' : 'Unused remainder'}</span>
      </div>
      {#each PARTIES as p}
        <div class="party-table-row">
          <span class="party-label">{p.label}</span>
          <span class="num">{p.unused.toLocaleString(lang === 'el' ? 'el-CY' : 'en-GB')}</span>
        </div>
      {/each}
      <div class="party-table-foot">
        <span>{lang === 'el' ? 'Σύνολο' : 'Total'}</span>
        <span class="num">{TOTAL_UNUSED.toLocaleString(lang === 'el' ? 'el-CY' : 'en-GB')}</span>
      </div>
    </div>
  </SectionBlock>

  <SectionBlock
    id="steps"
    eyebrow={lang === 'el' ? 'Βήμα-βήμα' : 'Step by step'}
    title={lang === 'el' ? 'Πώς υπολογίζονται οι έδρες' : 'How the seats are computed'}
  >
    <WorkedExampleStep
      step={1}
      eyebrow={lang === 'el' ? 'Βήμα 1' : 'Step 1'}
      title={lang === 'el' ? 'Εκλογικό μέτρο δεύτερης κατανομής' : 'The second-distribution electoral quota'}
    >
      {#snippet body()}
        <p>
          {#if lang === 'el'}
            Το <strong>εκλογικό μέτρο</strong> της δεύτερης κατανομής είναι το σύνολο των αχρησιμοποίητων υπολοίπων όλων των κομμάτων που <strong>πληρούν το όριο του 3,6%</strong>, διά τον αριθμό των αδιάθετων εδρών.
          {:else}
            The <strong>second-stage electoral quota</strong> is the sum of the unused remainders of all parties that <strong>clear the 3.6 % threshold</strong>, divided by the number of unallocated seats.
          {/if}
        </p>
        <KMath
          display
          expr={'Q_2 \\;=\\; \\left\\lfloor \\dfrac{99{,}000}{18} \\right\\rfloor \\;=\\; 5{,}500'}
        />
      {/snippet}
    </WorkedExampleStep>

    <WorkedExampleStep
      step={2}
      eyebrow={lang === 'el' ? 'Βήμα 2' : 'Step 2'}
      title={lang === 'el' ? 'Έδρες της δεύτερης κατανομής' : 'Stage-2 seat allocation'}
    >
      {#snippet body()}
        <p>
          {#if lang === 'el'}
            Για κάθε κόμμα, οι έδρες της δεύτερης κατανομής είναι ο ακέραιος προς τα κάτω της διαίρεσης του αχρησιμοποίητου υπολοίπου με το νέο εκλογικό μέτρο. Το υπόλοιπο μετά τη διαίρεση μεταφέρεται στην τρίτη κατανομή.
          {:else}
            For each party, the number of stage-2 seats is the floor of its unused remainder divided by the new quota. Whatever is left over carries forward to the third distribution.
          {/if}
        </p>

        <div class="party-table party-table--wide">
          <div class="party-table-head">
            <span>{lang === 'el' ? 'Κόμμα' : 'Party'}</span>
            <span class="num">{lang === 'el' ? 'Υπόλοιπο ÷ 5.500' : 'Remainder ÷ 5,500'}</span>
            <span class="num">{lang === 'el' ? 'Έδρες (φάση Β)' : 'Stage-2 seats'}</span>
            <span class="num">{lang === 'el' ? 'Νέο υπόλοιπο' : 'New remainder'}</span>
          </div>
          {#each PARTIES as p}
            <div class="party-table-row">
              <span class="party-label">{p.label}</span>
              <span class="num">
                {p.unused.toLocaleString(lang === 'el' ? 'el-CY' : 'en-GB')} ÷ {STAGE2_QUOTA.toLocaleString(lang === 'el' ? 'el-CY' : 'en-GB')}
              </span>
              <span class="num"><strong>{p.stage2}</strong></span>
              <span class="num">{p.stage2Rem.toLocaleString(lang === 'el' ? 'el-CY' : 'en-GB')}</span>
            </div>
          {/each}
          <div class="party-table-foot">
            <span>{lang === 'el' ? 'Σύνολο' : 'Total'}</span>
            <span></span>
            <span class="num"><strong>{STAGE2_TOTAL}</strong></span>
            <span></span>
          </div>
        </div>

        <p>
          {#if lang === 'el'}
            <strong>{STAGE2_TOTAL} από τις {REMAINING_SEATS}</strong> αδιάθετες έδρες δίνονται στη δεύτερη κατανομή. Μένουν <strong>{STAGE3_TOTAL} έδρες</strong> για την Β' φάση (τρίτη κατανομή).
          {:else}
            <strong>{STAGE2_TOTAL} of the {REMAINING_SEATS}</strong> unallocated seats are awarded in stage 2. <strong>{STAGE3_TOTAL} seats</strong> remain for stage 3 (the "Β' phase").
          {/if}
        </p>
      {/snippet}
    </WorkedExampleStep>

    <WorkedExampleStep
      step={3}
      eyebrow={lang === 'el' ? 'Βήμα 3' : 'Step 3'}
      title={lang === 'el' ? 'Τρίτη κατανομή — οι 2 τελευταίες έδρες' : 'Third distribution — the final 2 seats'}
    >
      {#snippet body()}
        <p>
          {#if lang === 'el'}
            Οι 2 έδρες που μένουν δίνονται <strong>μία προς μία</strong> στα κόμματα με τα μεγαλύτερα <em>νέα</em> υπόλοιπα (μετά τη δεύτερη κατανομή), με την προϋπόθεση ότι το κόμμα έχει συγκεντρώσει <strong>τουλάχιστον 7,2%</strong> των εγκύρων ψήφων.
          {:else}
            The remaining 2 seats are awarded <strong>one by one</strong> to the parties with the largest <em>new</em> remainders after stage 2, provided that the party has cleared <strong>at least 7.2 %</strong> of the valid vote nationally.
          {/if}
        </p>

        <ol class="rank-list">
          <li>
            <strong>Δ’</strong> — {lang === 'el' ? 'νέο υπόλοιπο' : 'new remainder'} <span class="num">4,000</span>
            → <strong>+1 {lang === 'el' ? 'έδρα' : 'seat'}</strong>
          </li>
          <li>
            <strong>Γ’</strong> — {lang === 'el' ? 'νέο υπόλοιπο' : 'new remainder'} <span class="num">3,500</span>
            → <strong>+1 {lang === 'el' ? 'έδρα' : 'seat'}</strong>
          </li>
          <li class="muted">
            <strong>Α’</strong> — 2,500 ({lang === 'el' ? 'εκτός' : 'misses out'})
          </li>
          <li class="muted">
            <strong>Ε’</strong> — 1,000 ({lang === 'el' ? 'εκτός' : 'misses out'})
          </li>
          <li class="muted">
            <strong>Β’</strong> — 0 ({lang === 'el' ? 'εκτός' : 'misses out'})
          </li>
        </ol>
      {/snippet}
    </WorkedExampleStep>

    <WorkedExampleStep
      step={4}
      eyebrow={lang === 'el' ? 'Βήμα 4' : 'Step 4'}
      title={lang === 'el' ? 'Συνολικές έδρες (φάση Β + Γ)' : 'Combined stage-2 + stage-3 totals'}
    >
      {#snippet body()}
        <p>
          {#if lang === 'el'}
            Αθροίζοντας τη δεύτερη και την τρίτη κατανομή, οι 18 αδιάθετες έδρες μοιράζονται ως εξής:
          {:else}
            Adding the second and third distributions together, the 18 unallocated seats split as follows:
          {/if}
        </p>
        <div class="party-table party-table--wide">
          <div class="party-table-head">
            <span>{lang === 'el' ? 'Κόμμα' : 'Party'}</span>
            <span class="num">{lang === 'el' ? 'Β φάση' : 'Stage 2'}</span>
            <span class="num">{lang === 'el' ? 'Γ φάση' : 'Stage 3'}</span>
            <span class="num">{lang === 'el' ? 'Σύνολο' : 'Total'}</span>
          </div>
          {#each PARTIES as p}
            <div class="party-table-row">
              <span class="party-label">{p.label}</span>
              <span class="num">{p.stage2}</span>
              <span class="num">{p.stage3}</span>
              <span class="num"><strong>{p.stage2 + p.stage3}</strong></span>
            </div>
          {/each}
          <div class="party-table-foot">
            <span>{lang === 'el' ? 'Σύνολο' : 'Total'}</span>
            <span class="num">{STAGE2_TOTAL}</span>
            <span class="num">{STAGE3_TOTAL}</span>
            <span class="num"><strong>{STAGE2_TOTAL + STAGE3_TOTAL}</strong></span>
          </div>
        </div>
      {/snippet}
    </WorkedExampleStep>
  </SectionBlock>

  <SectionBlock
    id="takeaway"
    eyebrow={lang === 'el' ? 'Συμπέρασμα' : 'Takeaway'}
    title={lang === 'el' ? 'Η κρυφή δύναμη της τρίτης κατανομής' : 'The hidden leverage of stage 3'}
  >
    <p>
      {#if lang === 'el'}
        Το <strong>Δ' κόμμα</strong>, που είχε μόλις 15.000 αχρησιμοποίητες ψήφους, παίρνει <strong>3 έδρες</strong> στη δεύτερη και τρίτη φάση — όσες και το <strong>Γ' κόμμα</strong> με 20.000. Αυτό συμβαίνει γιατί το νέο υπόλοιπο του Δ' μετά τη δεύτερη κατανομή (4.000 ψήφοι) είναι το μεγαλύτερο από όλα. Είναι ένα κλασικό παράδειγμα του πώς η <strong>τρίτη κατανομή</strong> μπορεί να εξισώσει κόμματα με διαφορετική αρχική απόδοση.
      {:else}
        Party <strong>Δ’</strong>, with only 15,000 unused votes, walks away with <strong>3 seats</strong> in stages 2+3 — the same as <strong>Γ’</strong> with 20,000. That is because Δ’'s new remainder after stage 2 (4,000 votes) is the largest of the bunch. It's a textbook case of how the <strong>third distribution</strong> can level the field between parties with quite different first-stage hauls.
      {/if}
    </p>
    <p>
      <a class="inline-link" href={`${base}/${lang}/worked-example`}>
        {lang === 'el' ? '← Επιστροφή στο Παράδειγμα 1 (Λευκωσία 2021)' : '← Back to Example 1 (Nicosia 2021)'}
      </a>
    </p>
  </SectionBlock>
</PageShell>

<style>
  .inline-link {
    color: var(--color-accent);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    font-weight: 600;
  }
  .inline-link:hover { text-decoration-thickness: 2px; }

  .party-table {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0;
    margin: var(--sp-5) 0;
    border-top: 1px solid var(--color-rule);
    font-family: var(--font-sans);
    font-size: var(--fs-200);
    max-width: 32rem;
  }
  .party-table--wide {
    grid-template-columns: auto 1fr auto auto;
    max-width: 44rem;
  }
  .party-table > div {
    display: contents;
  }
  .party-table-head > span,
  .party-table-row > span,
  .party-table-foot > span {
    padding: var(--sp-2) var(--sp-3);
    border-bottom: 1px solid var(--color-rule);
  }
  .party-table-head > span {
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-2);
    font-weight: 700;
    border-bottom-width: 2px;
  }
  .party-table-foot > span {
    background-color: var(--color-paper-2);
    font-weight: 600;
    color: var(--color-ink);
  }
  .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .party-label {
    font-weight: 600;
    color: var(--color-ink);
  }

  .rank-list {
    margin: var(--sp-4) 0;
    padding-left: 1.2em;
    font-family: var(--font-sans);
    font-size: var(--fs-200);
    line-height: var(--lh-relaxed);
  }
  .rank-list li {
    margin-bottom: var(--sp-2);
  }
  .rank-list li.muted {
    color: var(--color-ink-3, var(--color-ink-2));
    opacity: 0.7;
  }
</style>
