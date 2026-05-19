<script lang="ts">
  import { base } from '$app/paths';
  import { PageShell, SectionBlock } from '$components/layout';
  import { WorkedExampleNarrative } from '$lib/components/walkthrough';

  let { data } = $props();
  const lang = $derived(data.lang);
  const currentPath = $derived(data.currentPath);
</script>

<PageShell
  {lang}
  {currentPath}
  numeral="20"
  eyebrow={lang === 'el' ? 'Παράδειγμα' : 'Walkthrough'}
  title={lang === 'el' ? 'Λευκωσία 2021 βήμα-βήμα' : 'Nicosia 2021, step by step'}
  lede={lang === 'el'
    ? 'Πώς προέκυψαν οι 20 έδρες της Λευκωσίας στις εκλογές του 2021: η πραγματική αριθμητική του συστήματος, με τα πραγματικά δεδομένα.'
    : 'How Nicosia\'s 20 seats were actually allocated in the 2021 election: the real arithmetic, with the real numbers.'}
>
  <SectionBlock
    id="intro"
    eyebrow={lang === 'el' ? 'Εισαγωγή' : 'Intro'}
    title={lang === 'el' ? 'Γιατί χρησιμοποιούμε τη Λευκωσία' : 'Why we use Nicosia'}
  >
    <p>
      {#if lang === 'el'}
        Η <strong>Λευκωσία</strong> είναι η μεγαλύτερη επαρχία και προσφέρει το πιο διαφωτιστικό παράδειγμα του συστήματος: <strong>επτά κόμματα</strong> κέρδισαν έδρες στην πρώτη κατανομή, <strong>πέντε έδρες</strong> ξανατοποθετήθηκαν μέσω της εθνικής δεξαμενής, και ένα κόμμα (το <strong>ΑΚΕΛ</strong>) κατέληξε με <strong>περισσότερες έδρες από τον ΔΗΣΥ</strong> παρά το χαμηλότερο επαρχιακό του ποσοστό. Παρακάτω εκτελούμε ολόκληρο τον αλγόριθμο με τους πραγματικούς αριθμούς του 2021.
      {:else}
        <strong>Nicosia</strong> is the largest district and offers the clearest example of the system at work: <strong>seven parties</strong> won seats in the first distribution, <strong>five seats</strong> were re-allocated via the national pool, and one party (<strong>AKEL</strong>) ended with <strong>more seats than DISY</strong> despite a lower district share. Below we step through the whole algorithm with the real 2021 figures.
      {/if}
    </p>
  </SectionBlock>

  <WorkedExampleNarrative {lang} />

  <SectionBlock
    id="takeaway"
    eyebrow={lang === 'el' ? 'Συμπέρασμα' : 'Takeaway'}
    title={lang === 'el' ? 'Γιατί έχει σημασία' : 'Why it matters'}
  >
    <p>
      {#if lang === 'el'}
        Το παράδειγμα της Λευκωσίας δείχνει ότι το «κατά πόσο κέρδισε ένα κόμμα» <strong>δεν εξαρτάται μόνο από το ποσοστό του στην επαρχία</strong>, αλλά και από τις <strong>«αχρησιμοποίητες ψήφους»</strong> του, δηλαδή το υπόλοιπο μετά τις έδρες που κέρδισε στην πρώτη φάση. Αυτές οι ψήφοι ταξιδεύουν στην <strong>εθνική δεξαμενή</strong> και επιστρέφουν με τη μορφή επιπλέον εδρών εκεί όπου το κόμμα είχε το μεγαλύτερο υπόλοιπο. Στην ίδια λογική, ένα κόμμα <strong>κάτω από το 3,6% πανεθνικά</strong> χάνει <strong>όλες</strong> του τις ψήφους στις φάσεις 2 και 3, ανεξαρτήτως πόσο καλά πήγε σε μία επαρχία.
      {:else}
        The Nicosia example shows that "how well a party did" <strong>does not depend only on its district share</strong>, but also on its <strong>unused votes</strong>: the remainder left over after its first-stage seats. Those votes travel to the <strong>national pool</strong> and come back as extra seats wherever the party held the largest leftover pile. By the same logic, a party that falls <strong>below 3.6% nationally</strong> loses <strong>all</strong> of its votes from stages 2 and 3, no matter how well it did in any one district.
      {/if}
    </p>
    <p>
      <a class="inline-link" href={`${base}/${lang}/simulator`}>
        {lang === 'el' ? 'Δοκιμάστε το μόνοι σας στον προσομοιωτή →' : 'Try it yourself in the simulator →'}
      </a>
    </p>
    <p class="source-note">
      {#if lang === 'el'}
        Πηγή δεδομένων:
        <a
          class="inline-link"
          href="https://data.gov.cy/el/dataset/episima-apotelesmata-boyleytikon-eklogon-2021"
          target="_blank"
          rel="noopener noreferrer"
        >data.gov.cy — Επίσημα Αποτελέσματα Βουλευτικών Εκλογών 2021 ↗</a>
        (Υπουργείο Εσωτερικών, αναλυτικά στοιχεία ανά εκλογικό τμήμα, αθροισμένα κατά επαρχία × κόμμα). Διασταύρωση εκλεγέντων ανά επαρχία:
        <a
          class="inline-link"
          href="https://web.archive.org/web/20210531154919/https://www.sigmalive.com/news/politics/791942/aftoi-einai-oi-56-vouleftes-deite-poioi-ekselegisan"
          target="_blank"
          rel="noopener noreferrer"
        >SigmaLive — «Αυτοί είναι οι 56 βουλευτές» (31 Μαΐου 2021, αρχειοθετημένο) ↗</a>.
      {:else}
        Data source:
        <a
          class="inline-link"
          href="https://data.gov.cy/el/dataset/episima-apotelesmata-boyleytikon-eklogon-2021"
          target="_blank"
          rel="noopener noreferrer"
        >data.gov.cy — Official 2021 Parliamentary Election Results ↗</a>
        (Cyprus Ministry of Interior, polling-station-level data aggregated by district × party). Cross-check of the elected MPs per district:
        <a
          class="inline-link"
          href="https://web.archive.org/web/20210531154919/https://www.sigmalive.com/news/politics/791942/aftoi-einai-oi-56-vouleftes-deite-poioi-ekselegisan"
          target="_blank"
          rel="noopener noreferrer"
        >SigmaLive — "These are the 56 MPs" (31 May 2021, archived) ↗</a>.
      {/if}
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

  .source-note {
    margin-top: var(--sp-5);
    padding-top: var(--sp-4);
    border-top: 1px solid var(--color-rule);
    font-size: var(--fs-75);
    color: var(--color-ink-3);
    line-height: var(--lh-relaxed);
  }
</style>
