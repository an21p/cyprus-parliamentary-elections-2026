<script lang="ts">
  import { PageShell, SectionBlock } from '$components/layout';
  import { PARTIES, getParty } from '$data/parties';
  import { RESULTS_2021 } from '$data/results-2021';
  import { localizedName } from '$i18n/dict';
  import type { Lang, Party, PartyId } from '$data/types';

  let { data } = $props();
  const lang = $derived(data.lang);
  const currentPath = $derived(data.currentPath);

  // Quick lookup for 2021 national share, where applicable.
  const share2021 = new Map<PartyId, number>(
    RESULTS_2021.map((r) => [r.partyId, r.nationalShare])
  );

  function fmtShare(p: Party, l: Lang): string | null {
    const s = share2021.get(p.id);
    if (s === undefined) return null;
    const formatted = l === 'el' ? s.toFixed(2).replace('.', ',') : s.toFixed(2);
    return `${formatted}%`;
  }

  // Curated narrative blurbs per party — neutral and short. Render below the
  // cookie-cutter card metadata. Used only where we have a story to tell;
  // smaller lists fall back to the party's `alignment` field.
  const NARRATIVES: Partial<Record<PartyId, { en: string; el: string }>> = {
    DISY: {
      en: 'The dominant centre-right list of the past two decades. Annita Demetriou — the youngest party leader and first female Speaker of the House (2021) — succeeded Averof Neofytou after the 2023 presidential defeat.',
      el: 'Το κυρίαρχο κεντροδεξιό κόμμα των τελευταίων δύο δεκαετιών. Η Αννίτα Δημητρίου — η νεότερη αρχηγός και πρώτη γυναίκα Πρόεδρος της Βουλής (2021) — διαδέχθηκε τον Αβέρωφ Νεοφύτου μετά την προεδρική ήττα του 2023.'
    },
    AKEL: {
      en: 'The historic Cypriot left, rooted in the 1926 communist movement. Rebranded as "AKEL – Social Alliance" after the 2024 European Parliament election, having absorbed smaller left-leaning groups.',
      el: 'Η ιστορική κυπριακή αριστερά, με ρίζες στο κομμουνιστικό κίνημα του 1926. Από τις Ευρωεκλογές 2024 παρουσιάζεται ως «ΑΚΕΛ – Κοινωνική Συμμαχία», απορροφώντας μικρότερες αριστερές δυνάμεις.'
    },
    DIKO: {
      en: 'Centrist with a Greek-Cypriot nationalist tradition. Polls show it falling to a historic low of 7–9%. Supports the Christodoulides government.',
      el: 'Κεντρώο με ελληνοκυπριακή εθνικιστική παράδοση. Οι δημοσκοπήσεις δείχνουν πτώση σε ιστορικό χαμηλό 7–9%. Στηρίζει την κυβέρνηση Χριστοδουλίδη.'
    },
    ELAM: {
      en: 'Far-right, originally close to Greek "Golden Dawn"; now affiliated with the ECR group. Has consolidated firmly in third place across the 2026 campaign, with the highest voter-loyalty rate of any party.',
      el: 'Άκρας δεξιάς, αρχικά κοντά στην ελληνική «Χρυσή Αυγή»· σήμερα συνδέεται με την ομάδα ECR. Παγιώθηκε στην τρίτη θέση κατά τη διάρκεια της εκστρατείας του 2026, με την υψηλότερη συσπείρωση από κάθε άλλο κόμμα.'
    },
    EDEK: {
      en: 'Social-democratic (S&D-affiliated). Currently 2 seats: from 4 elected in 2021, one MP was expelled and one resigned. Hovering near the 3.6% threshold in late polls.',
      el: 'Σοσιαλδημοκρατικό (S&D). Σήμερα 2 έδρες: από τις 4 του 2021, ένας βουλευτής διαγράφηκε και ένας παραιτήθηκε. Στις τελευταίες δημοσκοπήσεις κινείται γύρω από το όριο του 3,6%.'
    },
    DIPA: {
      en: 'Centrist liberal split from DIKO in 2018. Leader Marios Garoyian is not standing himself in 2026. Polling consistently below the 3.6% threshold.',
      el: 'Κεντρώο φιλελεύθερο, απόσχιση από ΔΗΚΟ το 2018. Ο επικεφαλής Μάριος Καρογιάν δεν κατεβαίνει ο ίδιος υποψήφιος το 2026. Στις δημοσκοπήσεις κινείται σταθερά κάτω από το 3,6%.'
    },
    KOSP: {
      en: 'Cypriot Greens. Runs a joint list with the Animal Party Cyprus for 2026 after Alexandra Attalides defected to Volt.',
      el: 'Κυπριακοί Πράσινοι. Κατεβαίνει με κοινή λίστα με το Κόμμα για τα Ζώα Κύπρου το 2026, μετά την αποχώρηση της Αλεξάνδρας Ατταλίδου προς το Volt.'
    },
    VOLT: {
      en: 'Pan-European federalist (part of Volt Europa). First general-election test in Cyprus, with one outgoing MP (Alexandra Attalides, who switched from KOSP).',
      el: 'Πανευρωπαϊκό φεντεραλιστικό κόμμα (μέρος του Volt Europa). Πρώτη συμμετοχή σε βουλευτικές εκλογές στην Κύπρο, με μία απερχόμενη βουλεύτρια (Αλεξάνδρα Ατταλίδου, αποσκιρτώντας από ΚΟΣΠ).'
    },
    ALMA: {
      en: 'Founded May 2025 by former Auditor-General Odysseas Michaelides on an anti-corruption, pro-federal-solution platform. The full ballot name is "ALMA – Citizens for Cyprus"; Michaelides is widely expected to run for the presidency in 2028.',
      el: 'Ιδρύθηκε τον Μάιο 2025 από τον πρώην Γενικό Ελεγκτή Οδυσσέα Μιχαηλίδη με ατζέντα κατά της διαφθοράς και υπέρ ομοσπονδιακής λύσης. Πλήρες όνομα στο ψηφοδέλτιο: «ΑΛΜΑ – Πολίτες για την Κύπρο»· ο ίδιος θεωρείται πιθανός υποψήφιος για την προεδρία το 2028.'
    },
    ADK: {
      en: 'Founded October 2025 by MEP Fidias Panayiotou (b. 2000, YouTube influencer), who won 19.4% in the 2024 EP election. Candidates were selected via the "Agorà" mobile app; Panayiotou was elected party president on 22 March 2026 with 4,006 internal votes.',
      el: 'Ιδρύθηκε τον Οκτώβριο 2025 από τον ευρωβουλευτή Φειδία Παναγιώτου (γενν. 2000, YouTuber), ο οποίος κέρδισε 19,4% στις Ευρωεκλογές 2024. Οι υποψήφιοι επιλέχθηκαν μέσω της εφαρμογής «Agorà»· ο ίδιος εκλέχθηκε πρόεδρος του κόμματος στις 22 Μαρτίου 2026 με 4.006 εσωτερικές ψήφους.'
    },
    DEK: {
      en: 'Founded January 2025 by former ELAM MP Andreas Themistokleous. Religious-conservative and nationalist, positioning itself to ELAM\'s social-conservative flank.',
      el: 'Ιδρύθηκε τον Ιανουάριο 2025 από τον πρώην βουλευτή του ΕΛΑΜ Ανδρέα Θεμιστοκλέους. Θρησκευτικού-συντηρητικού και εθνικιστικού προσανατολισμού, τοποθετείται στη συντηρητική κοινωνική πτέρυγα του ΕΛΑΜ.'
    },
    DIMAL: {
      en: 'Founded 2025 by lawyer Christos Clerides, former chair of the Cyprus Bar Association. Centrist reformist platform.',
      el: 'Ιδρύθηκε το 2025 από τον δικηγόρο Χρήστο Κληρίδη, πρώην πρόεδρο του Παγκύπριου Δικηγορικού Συλλόγου. Κεντρώου, μεταρρυθμιστικού χαρακτήρα.'
    }
  };

  // Group lookup buckets
  const BIG_TWO: PartyId[] = ['DISY', 'AKEL'];
  const INCUMBENTS: PartyId[] = ['DIKO', 'ELAM', 'EDEK', 'DIPA', 'KOSP', 'VOLT'];
  const NEW_ENTRANTS: PartyId[] = ['ALMA', 'ADK', 'DEK', 'DIMAL'];
  const MINOR: PartyId[] = ['KEKK', 'LAKE', 'SIKOU', 'FARL', 'POPSF', 'AGRO', 'GRNC'];
</script>

<PageShell
  {lang}
  {currentPath}
  eyebrow={lang === 'el' ? 'Κόμματα' : 'Parties'}
  title={lang === 'el' ? '19 κόμματα και 9 ανεξάρτητοι' : '19 parties and 9 independents'}
  lede={lang === 'el'
    ? 'Από τον ΔΗΣΥ και το ΑΚΕΛ μέχρι τα νέα κόμματα ΑΛΜΑ, Άμεση Δημοκρατία Κύπρου και Volt — ο πλήρης κατάλογος των υποψηφίων λιστών για τις 24 Μαΐου 2026.'
    : 'From DISY and AKEL to the new entrants ALMA, Direct Democracy Cyprus and Volt — the full slate of lists contesting 24 May 2026.'}
>
  <SectionBlock
    id="big-two"
    eyebrow={lang === 'el' ? 'Τα μεγάλα κόμματα' : 'The big two'}
    title={lang === 'el' ? 'ΔΗΣΥ και ΑΚΕΛ' : 'DISY and AKEL'}
  >
    <p>
      {lang === 'el'
        ? 'Από το 1981 ως το 2021, η εκλογική μάχη της Κύπρου διεξαγόταν κυρίως μεταξύ Δημοκρατικού Συναγερμού και ΑΚΕΛ. Το συνδυασμένο τους ποσοστό άγγιξε το 68,7% το 2001 και ξεπερνούσε σταθερά το 50%. Το 2026 αναμένεται να πέσει για πρώτη φορά κάτω από αυτό το όριο.'
        : 'From 1981 until 2021, Cypriot elections were fought primarily between DISY and AKEL. Their combined share peaked at 68.7% in 2001 and routinely cleared 50%. In 2026 it is expected to fall below that mark for the first time.'}
    </p>
    <div class="party-grid">
      {#each BIG_TWO as pid (pid)}
        {@const party = getParty(pid)}
        <article class="party-card party-card--big">
          <header class="party-head">
            <span class="party-swatch" style="background-color: {party.colour};" aria-hidden="true"></span>
            <div>
              <p class="party-name">{localizedName(party, lang)}</p>
              <p class="party-short">{localizedName(party.shortName, lang)}</p>
            </div>
          </header>
          <dl class="party-meta">
            <div>
              <dt>{lang === 'el' ? 'Αρχηγός' : 'Leader'}</dt>
              <dd>{localizedName(party.leader, lang)}</dd>
            </div>
            <div>
              <dt>{lang === 'el' ? 'Προσανατολισμός' : 'Alignment'}</dt>
              <dd>{localizedName(party.alignment, lang)}</dd>
            </div>
            {#if fmtShare(party, lang)}
              <div>
                <dt>{lang === 'el' ? 'Ποσοστό 2021' : '2021 share'}</dt>
                <dd>{fmtShare(party, lang)}</dd>
              </div>
            {/if}
            {#if party.seatsOutgoing !== null}
              <div>
                <dt>{lang === 'el' ? 'Έδρες απερχ.' : 'Outgoing seats'}</dt>
                <dd>{party.seatsOutgoing}</dd>
              </div>
            {/if}
          </dl>
          {#if NARRATIVES[pid]}
            <p class="party-narrative">{NARRATIVES[pid]?.[lang]}</p>
          {/if}
        </article>
      {/each}
    </div>
  </SectionBlock>

  <SectionBlock
    id="incumbents"
    eyebrow={lang === 'el' ? 'Κοινοβουλευτικά κόμματα' : 'Sitting parties'}
    title={lang === 'el' ? 'Τα υπόλοιπα κόμματα της απερχόμενης Βουλής' : 'Other parties in the outgoing parliament'}
  >
    <p>
      {lang === 'el'
        ? 'Η απερχόμενη Βουλή πλαισιωνόταν και από έξι μικρότερα κοινοβουλευτικά κόμματα. Δύο τους (ΕΔΕΚ και ΔΗΠΑ) εμφανίζονται οριακά πάνω ή κάτω από το όριο του 3,6%.'
        : 'The outgoing parliament also seated six smaller lists. Two of them (EDEK and DIPA) are running close to — or below — the 3.6% threshold.'}
    </p>
    <div class="party-grid">
      {#each INCUMBENTS as pid (pid)}
        {@const party = getParty(pid)}
        <article class="party-card">
          <header class="party-head">
            <span class="party-swatch" style="background-color: {party.colour};" aria-hidden="true"></span>
            <div>
              <p class="party-name">{localizedName(party, lang)}</p>
              <p class="party-short">{localizedName(party.shortName, lang)}</p>
            </div>
          </header>
          <dl class="party-meta">
            <div>
              <dt>{lang === 'el' ? 'Αρχηγός' : 'Leader'}</dt>
              <dd>{localizedName(party.leader, lang)}</dd>
            </div>
            <div>
              <dt>{lang === 'el' ? 'Προσανατολισμός' : 'Alignment'}</dt>
              <dd>{localizedName(party.alignment, lang)}</dd>
            </div>
            {#if fmtShare(party, lang)}
              <div>
                <dt>{lang === 'el' ? 'Ποσοστό 2021' : '2021 share'}</dt>
                <dd>{fmtShare(party, lang)}</dd>
              </div>
            {/if}
            {#if party.seatsOutgoing !== null}
              <div>
                <dt>{lang === 'el' ? 'Έδρες απερχ.' : 'Outgoing seats'}</dt>
                <dd>{party.seatsOutgoing}</dd>
              </div>
            {/if}
          </dl>
          {#if NARRATIVES[pid]}
            <p class="party-narrative">{NARRATIVES[pid]?.[lang]}</p>
          {/if}
        </article>
      {/each}
    </div>
  </SectionBlock>

  <SectionBlock
    id="new"
    eyebrow={lang === 'el' ? 'Νέα κόμματα' : 'New entrants'}
    title={lang === 'el' ? 'Τα κόμματα που πρωτοκατεβαίνουν' : 'Parties contesting for the first time'}
  >
    <p>
      {lang === 'el'
        ? 'Τέσσερα κόμματα κατεβαίνουν για πρώτη φορά σε βουλευτικές εκλογές. Τα δύο πρώτα — ΑΛΜΑ και Άμεση Δημοκρατία Κύπρου — βρίσκονται καλά πάνω από το όριο εισόδου σύμφωνα με τις δημοσκοπήσεις και θα μπουν σχεδόν σίγουρα στη Βουλή.'
        : 'Four parties are contesting a parliamentary election for the first time. The two leaders — ALMA and Direct Democracy Cyprus — are polling well above the threshold and look near-certain to enter the House.'}
    </p>
    <div class="party-grid">
      {#each NEW_ENTRANTS as pid (pid)}
        {@const party = getParty(pid)}
        <article class="party-card">
          <header class="party-head">
            <span class="party-swatch" style="background-color: {party.colour};" aria-hidden="true"></span>
            <div>
              <p class="party-name">{localizedName(party, lang)}</p>
              <p class="party-short">{localizedName(party.shortName, lang)}</p>
            </div>
          </header>
          <dl class="party-meta">
            <div>
              <dt>{lang === 'el' ? 'Αρχηγός' : 'Leader'}</dt>
              <dd>{localizedName(party.leader, lang)}</dd>
            </div>
            <div>
              <dt>{lang === 'el' ? 'Προσανατολισμός' : 'Alignment'}</dt>
              <dd>{localizedName(party.alignment, lang)}</dd>
            </div>
          </dl>
          {#if NARRATIVES[pid]}
            <p class="party-narrative">{NARRATIVES[pid]?.[lang]}</p>
          {/if}
        </article>
      {/each}
    </div>
  </SectionBlock>

  <SectionBlock
    id="minor"
    eyebrow={lang === 'el' ? 'Μικρότερες λίστες' : 'Smaller lists'}
    title={lang === 'el' ? 'Λοιπές λίστες' : 'Other lists'}
  >
    <p>
      {lang === 'el'
        ? 'Επτά μικρότερες λίστες συμπληρώνουν τις 19 υποψηφιότητες. Καμία δεν εμφανίζεται κοντά στο όριο εισόδου, αλλά πολλές εκπροσωπούν ένα συγκεκριμένο εκλογικό αίτημα ή κοινωνική ομάδα.'
        : 'Seven smaller lists round out the 19 parties on the ballot. None is polling near the 3.6% threshold, but several represent a particular constituency or single-issue cause.'}
    </p>
    <ul class="minor-list">
      {#each MINOR as pid (pid)}
        {@const party = getParty(pid)}
        <li class="minor-item">
          <span class="party-swatch party-swatch--sm" style="background-color: {party.colour};" aria-hidden="true"></span>
          <div class="minor-text">
            <p class="minor-name">{localizedName(party, lang)} <span class="minor-short">({localizedName(party.shortName, lang)})</span></p>
            <p class="minor-detail">
              {localizedName(party.leader, lang)} · {localizedName(party.alignment, lang)}
              {#if party.notes}— {localizedName(party.notes, lang)}{/if}
            </p>
          </div>
        </li>
      {/each}
    </ul>
  </SectionBlock>

  <SectionBlock
    id="independents"
    eyebrow={lang === 'el' ? 'Ανεξάρτητοι' : 'Independents'}
    title={lang === 'el' ? 'Εννέα ανεξάρτητοι υποψήφιοι' : 'Nine independent candidates'}
  >
    <p>
      {lang === 'el'
        ? 'Πέρα από τις 19 λίστες, εννέα ανεξάρτητοι υποψήφιοι θα εμφανιστούν στα ψηφοδέλτια χωρίς κομματική σήμανση. Στο κυπριακό σύστημα οι ανεξάρτητοι αντιμετωπίζονται όπως μία μονομελής λίστα και θεωρητικά οφείλουν να πληρούν τα ίδια εθνικά όρια — γεγονός που πρακτικά καθιστά εξαιρετικά δύσκολη την εκλογή τους χωρίς ευρεία επαρχιακή απήχηση.'
        : 'Beyond the 19 parties, nine independent candidates will appear on the ballots without any party affiliation. Under the Cypriot system, independents are treated as single-name lists and are nominally held to the same national thresholds — which makes their election very difficult absent broad district-level support.'}
    </p>
  </SectionBlock>
</PageShell>

<style>
  .party-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-4);
  }
  @media (min-width: 640px) {
    .party-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .party-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .party-card {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    padding: var(--sp-5);
    background-color: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-3);
  }
  .party-card--big {
    border-color: var(--color-rule-strong);
  }

  .party-head {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
  }
  .party-swatch {
    display: inline-block;
    width: 26px;
    height: 26px;
    border-radius: var(--radius-2);
    flex-shrink: 0;
    border: 1px solid var(--color-rule);
  }
  .party-swatch--sm {
    width: 14px;
    height: 14px;
    border-radius: var(--radius-pill);
    margin-top: 0.35em;
  }
  .party-name {
    font-family: var(--font-display);
    font-size: var(--fs-300);
    font-weight: 600;
    line-height: var(--lh-snug);
    color: var(--color-ink);
    margin: 0;
  }
  .party-short {
    font-family: var(--font-sans);
    font-size: var(--fs-75);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    margin: 0;
  }

  .party-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-3);
    margin: 0;
  }
  .party-meta > div { min-width: 0; }
  .party-meta dt {
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-ink-3);
    margin: 0;
  }
  .party-meta dd {
    font-size: var(--fs-100);
    color: var(--color-ink);
    margin: 0;
    line-height: var(--lh-snug);
  }

  .party-narrative {
    font-size: var(--fs-100);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
    margin: 0;
  }

  .minor-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--sp-3);
  }
  .minor-item {
    display: flex;
    gap: var(--sp-3);
    align-items: flex-start;
    padding: var(--sp-3) 0;
    border-top: 1px solid var(--color-rule);
  }
  .minor-item:first-child { border-top: 0; padding-top: 0; }
  .minor-text { min-width: 0; }
  .minor-name {
    font-family: var(--font-display);
    font-size: var(--fs-200);
    font-weight: 600;
    color: var(--color-ink);
    margin: 0;
  }
  .minor-short {
    font-family: var(--font-sans);
    font-weight: 400;
    color: var(--color-ink-3);
    font-size: var(--fs-100);
  }
  .minor-detail {
    font-size: var(--fs-75);
    color: var(--color-ink-3);
    line-height: var(--lh-snug);
    margin: var(--sp-1) 0 0;
  }
</style>
