<script lang="ts">
  import { PageShell, SectionBlock, Callout, StatGrid, StatCard } from '$components/layout';
  import { PollTracker } from '$components/charts';
  import { t } from '$i18n/dict';
  import type { PartyId } from '$data/types';

  let { data } = $props();
  const lang = $derived(data.lang);
  const currentPath = $derived(data.currentPath);

  const leadersForChart: PartyId[] = ['DISY', 'AKEL', 'ELAM', 'ALMA', 'ADK'];

  const title = $derived(t(lang, 'site.title'));
  const description = $derived(t(lang, 'home.lede'));
  const ogLocale = $derived(lang === 'el' ? 'el_GR' : 'en_GB');
  const ogLocaleAlt = $derived(lang === 'el' ? 'en_GB' : 'el_GR');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:locale" content={ogLocale} />
  <meta property="og:locale:alternate" content={ogLocaleAlt} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>

<PageShell
  {lang}
  {currentPath}
  numeral="56"
  eyebrow={lang === 'el' ? 'Κυριακή 24 Μαΐου 2026' : 'Sunday 24 May 2026'}
  title={t(lang, 'site.title')}
  lede={t(lang, 'home.lede')}
>
  <SectionBlock
    id="overview"
    eyebrow={lang === 'el' ? 'Σύνοψη' : 'In brief'}
    title={lang === 'el' ? 'Μια Βουλή σε επτά κομμάτια' : 'A seven-way parliament'}
  >
    <p>
      {lang === 'el'
        ? 'Για πρώτη φορά από το 1985, καμία πολιτική δύναμη δεν φαίνεται να φτάνει το 25%. Οι τελευταίες δημοσκοπήσεις δείχνουν επτά κόμματα να εισέρχονται στη Βουλή των Αντιπροσώπων: ΔΗΣΥ και ΑΚΕΛ ισόπαλα γύρω στο 18–22%, ΕΛΑΜ τρίτο γύρω στο 10–15%, και τρία νέα μορφώματα (ΑΛΜΑ, Άμεση Δημοκρατία Κύπρου του Φειδία, και Volt) να ξεπερνούν το όριο του 3,6%. Ο συνδυασμός ΔΗΣΥ+ΑΚΕΛ, που το 2001 άγγιξε το 68,7%, πέφτει για πρώτη φορά κάτω από το μισό των εδρών.'
        : 'For the first time since 1985, no single party is on track to clear 25%. Final-week polling shows seven parties entering the House of Representatives: DISY and AKEL roughly level at 18–22%, ELAM consolidating in third at 10–15%, and three newcomers (ALMA, Direct Democracy Cyprus and Volt) sitting on or above the 3.6% threshold. The combined DISY+AKEL share, which peaked at 68.7% in 2001, will fall below half of the seats for the first time in modern Cypriot politics.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Αυτή η σελίδα εξηγεί πώς το εκλογικό σύστημα μετατρέπει τις ψήφους σε έδρες και γιατί δύο κόμματα με σχεδόν ίδιο εθνικό ποσοστό μπορούν να καταλήξουν με πολύ διαφορετικό αριθμό εδρών. Ο '
        : 'This site explains how the electoral arithmetic turns votes into seats, and why two parties on nearly identical national shares can end up with very different seat counts. The '}<a class="inline-link" href={`/${lang}/simulator`}>{lang === 'el' ? 'προσομοιωτής' : 'simulator'}</a>{lang === 'el'
        ? ' σας επιτρέπει να δοκιμάσετε τα δικά σας σενάρια.'
        : ' lets you try the math yourself.'}
    </p>
  </SectionBlock>

  <SectionBlock
    id="key-numbers"
    eyebrow={lang === 'el' ? 'Βασικοί αριθμοί' : 'Key numbers'}
    title={lang === 'el' ? 'Η εκλογή σε νούμερα' : 'The election in numbers'}
  >
    <StatGrid columns={4}>
      <StatCard
        eyebrow={lang === 'el' ? 'Βουλή' : 'House'}
        value="56"
        caption={lang === 'el' ? 'εκλεγόμενες έδρες (από 80 συνταγματικές)' : 'elected seats (of 80 constitutionally)'}
      />
      <StatCard
        eyebrow={lang === 'el' ? 'Επαρχίες' : 'Districts'}
        value="6"
        caption={lang === 'el' ? 'από Κερύνεια (3 έδρες) έως Λευκωσία (19)' : 'from Kyrenia (3 seats) to Nicosia (19)'}
      />
      <StatCard
        eyebrow={lang === 'el' ? 'Υποψηφιότητες' : 'On the ballot'}
        value="19"
        caption={lang === 'el' ? 'κόμματα και 9 ανεξάρτητοι (753 υποψήφιοι)' : 'parties plus 9 independents (753 candidates)'}
      />
      <StatCard
        eyebrow={lang === 'el' ? 'Όριο εισόδου' : 'Threshold'}
        value="3,6%"
        caption={lang === 'el' ? 'εθνικά, για να συμμετάσχει κόμμα στην 2η κατανομή' : 'national, to participate in the second distribution'}
      />
    </StatGrid>
  </SectionBlock>

  <SectionBlock
    id="polls"
    eyebrow={lang === 'el' ? 'Δημοσκοπήσεις' : 'What the polls say'}
    title={lang === 'el' ? 'Πέντε κόμματα διεκδικούν την κορυφή' : 'Five parties competing at the top'}
  >
    <p>
      {lang === 'el'
        ? 'Στη φάρα της εβδομάδας πριν από τις εκλογές, οι δύο μεγαλύτεροι ιστορικοί αντίπαλοι, ΔΗΣΥ και ΑΚΕΛ, εμφανίζονται στατιστικά ισοπαλίες. Πίσω τους έχει εδραιωθεί το ΕΛΑΜ ως τρίτη δύναμη, ενώ τα νέα κόμματα ΑΛΜΑ και Άμεση Δημοκρατία Κύπρου μπαίνουν για πρώτη φορά στο πεδίο. Το παρακάτω γράφημα δείχνει την πορεία των πέντε αυτών κομμάτων στις δημοσιευμένες δημοσκοπήσεις από τα τέλη του 2024.'
        : 'In the final week before the vote, the two historic giants, DISY and AKEL, are statistically tied. Behind them, ELAM has consolidated as the third force, and two newcomers, ALMA and Direct Democracy Cyprus, are contesting their first parliamentary election. The chart below tracks the five leaders across every published poll since late 2024.'}
    </p>
    <PollTracker {lang} parties={leadersForChart} />
  </SectionBlock>

  <SectionBlock
    id="signposts"
    eyebrow={lang === 'el' ? 'Πλοήγηση' : 'Where to start'}
    title={lang === 'el' ? 'Τρεις προτεινόμενες αφετηρίες' : 'Three places to begin'}
  >
    <div class="signposts">
      <a class="signpost" href={`/${lang}/system`}>
        <p class="signpost-eyebrow">{lang === 'el' ? 'Το σύστημα' : 'The system'}</p>
        <p class="signpost-title">{lang === 'el' ? 'Πώς εκλέγονται 56 έδρες σε τρεις φάσεις' : 'How 56 seats are filled in three stages'}</p>
        <p class="signpost-body">
          {lang === 'el'
            ? 'Επαρχιακό μέτρο Hare, εθνική δεξαμενή με όριο 3,6%, υπόλοιπες έδρες με 7,2%.'
            : 'District Hare quota, national pool with 3.6% threshold, residual seats at 7.2%.'}
        </p>
        <p class="signpost-cta">{lang === 'el' ? 'Διαβάστε →' : 'Read →'}</p>
      </a>

      <a class="signpost" href={`/${lang}/simulator`}>
        <p class="signpost-eyebrow">{lang === 'el' ? 'Διαδραστικό' : 'Interactive'}</p>
        <p class="signpost-title">{lang === 'el' ? 'Ο προσομοιωτής εδρών' : 'The seat allocation simulator'}</p>
        <p class="signpost-body">
          {lang === 'el'
            ? 'Δώστε ποσοστά σε κάθε κόμμα και δείτε ποιες έδρες κερδίζονται και ποιες ψήφοι χάνονται κάτω από το όριο.'
            : 'Set a share for each party and watch how seats are won, and how votes vanish below the threshold.'}
        </p>
        <p class="signpost-cta">{lang === 'el' ? 'Δοκιμάστε →' : 'Try it →'}</p>
      </a>

      <a class="signpost" href={`/${lang}/polls`}>
        <p class="signpost-eyebrow">{lang === 'el' ? 'Δεδομένα' : 'Data'}</p>
        <p class="signpost-title">{lang === 'el' ? 'Ο πλήρης πίνακας δημοσκοπήσεων' : 'The full polling table'}</p>
        <p class="signpost-body">
          {lang === 'el'
            ? 'Κάθε δημοσκόπηση από τον Οκτώβριο 2024 ως τις 17 Μαΐου 2026, με εταιρεία, εντολέα και δείγμα.'
            : 'Every published poll from October 2024 to 17 May 2026, with pollster, commissioner and sample.'}
        </p>
        <p class="signpost-cta">{lang === 'el' ? 'Δείτε →' : 'Browse →'}</p>
      </a>
    </div>
  </SectionBlock>

  <Callout tone="fact">
    <strong>{lang === 'el' ? 'Απαγόρευση δημοσκοπήσεων' : 'Poll blackout'}:</strong>
    {lang === 'el'
      ? ' Από τις 22:00 της Παρασκευής 22 Μαΐου έως το κλείσιμο των καλπών στις 18:00 της Κυριακής 24 Μαΐου, ο κυπριακός νόμος απαγορεύει τη δημοσίευση νέων δημοσκοπήσεων. Η τελευταία έγκυρη δημοσκόπηση που μπορεί να δημοσιευτεί είναι αυτή της Παρασκευής 15 / Σαββάτου 16 Μαΐου 2026.'
      : ' From 22:00 on Friday 22 May until polls close at 18:00 on Sunday 24 May, Cypriot law forbids the publication of new poll figures. The last legal publication window closed on Friday 15 / Saturday 16 May 2026.'}
  </Callout>
</PageShell>

<style>
  .inline-link {
    color: var(--color-accent);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }
  .inline-link:hover { text-decoration-thickness: 2px; }

  .signposts {
    display: grid;
    gap: var(--sp-4);
    grid-template-columns: 1fr;
  }
  @media (min-width: 720px) {
    .signposts { grid-template-columns: repeat(3, 1fr); }
  }
  .signpost {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    padding: var(--sp-5);
    background-color: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
    text-decoration: none;
    color: var(--color-ink);
    transition: border-color var(--dur-fast) var(--ease-standard),
                transform var(--dur-fast) var(--ease-standard);
  }
  .signpost:hover { border-color: var(--color-accent); transform: translateY(-2px); }
  .signpost:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .signpost-eyebrow {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-accent);
    margin: 0;
    font-weight: 600;
  }
  .signpost-title {
    font-family: var(--font-display);
    font-variation-settings: var(--fvs-display-md);
    font-size: var(--fs-300);
    font-weight: 600;
    line-height: var(--lh-snug);
    letter-spacing: var(--tracking-snug);
    margin: 0;
    color: var(--color-ink);
    text-wrap: balance;
  }
  .signpost-body {
    font-size: var(--fs-100);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
    margin: 0;
  }
  .signpost-cta {
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    color: var(--color-accent);
    font-weight: 600;
    margin: var(--sp-2) 0 0;
  }
</style>
