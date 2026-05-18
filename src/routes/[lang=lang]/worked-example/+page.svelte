<script lang="ts">
  import { PageShell, SectionBlock } from '$components/layout';
  import { WorkedExampleNarrative } from '$lib/components/walkthrough';

  let { data } = $props();
  const lang = $derived(data.lang);
  const currentPath = $derived(data.currentPath);
</script>

<PageShell
  {lang}
  {currentPath}
  eyebrow={lang === 'el' ? 'Παράδειγμα' : 'Walkthrough'}
  title={lang === 'el' ? 'Λευκωσία 2021 βήμα-βήμα' : 'Nicosia 2021, step by step'}
  lede={lang === 'el'
    ? 'Πώς προέκυψαν οι 20 έδρες της Λευκωσίας στις εκλογές του 2021 — η πραγματική αριθμητική του συστήματος, με τα πραγματικά δεδομένα.'
    : 'How Nicosia\'s 20 seats were actually allocated in the 2021 election — the real arithmetic, with the real numbers.'}
>
  <SectionBlock
    id="intro"
    eyebrow={lang === 'el' ? 'Εισαγωγή' : 'Intro'}
    title={lang === 'el' ? 'Γιατί χρησιμοποιούμε τη Λευκωσία' : 'Why we use Nicosia'}
  >
    <p>
      {lang === 'el'
        ? 'Η Λευκωσία είναι η μεγαλύτερη επαρχία και προσφέρει το πιο διαφωτιστικό παράδειγμα του συστήματος: επτά κόμματα κέρδισαν έδρες στην πρώτη κατανομή, πέντε έδρες ξανατοποθετήθηκαν μέσω της εθνικής δεξαμενής, και ένα κόμμα (το ΑΚΕΛ) κατέληξε με περισσότερες έδρες από τον ΔΗΣΥ παρά το χαμηλότερο επαρχιακό του ποσοστό. Παρακάτω εκτελούμε ολόκληρο τον αλγόριθμο με τους πραγματικούς αριθμούς του 2021.'
        : 'Nicosia is the largest district and offers the clearest example of the system at work: seven parties won seats in the first distribution, five seats were re-allocated via the national pool, and one party (AKEL) ended with more seats than DISY despite a lower district share. Below we step through the whole algorithm with the real 2021 figures.'}
    </p>
  </SectionBlock>

  <WorkedExampleNarrative {lang} />

  <SectionBlock
    id="takeaway"
    eyebrow={lang === 'el' ? 'Συμπέρασμα' : 'Takeaway'}
    title={lang === 'el' ? 'Γιατί έχει σημασία' : 'Why it matters'}
  >
    <p>
      {lang === 'el'
        ? 'Το παράδειγμα της Λευκωσίας δείχνει ότι το «κατά πόσο κέρδισε ένα κόμμα» δεν εξαρτάται μόνο από το ποσοστό του στην επαρχία, αλλά και από τις «αχρησιμοποίητες ψήφους» του — το υπόλοιπο μετά τις έδρες που κέρδισε στην πρώτη φάση. Αυτές οι ψήφοι ταξιδεύουν στην εθνική δεξαμενή και επιστρέφουν με τη μορφή επιπλέον εδρών εκεί όπου το κόμμα είχε το μεγαλύτερο υπόλοιπο. Στην ίδια λογική, ένα κόμμα κάτω από το 3,6% πανεθνικά χάνει όλες του τις ψήφους στις φάσεις 2 και 3, ανεξαρτήτως πόσο καλά πήγε σε μία επαρχία.'
        : 'The Nicosia example shows that "how well a party did" does not depend only on its district share, but also on its unused votes — the remainder left over after its first-stage seats. Those votes travel to the national pool and come back as extra seats wherever the party held the largest leftover pile. By the same logic, a party that falls below 3.6% nationally loses all of its votes from stages 2 and 3, no matter how well it did in any one district.'}
    </p>
    <p>
      <a class="inline-link" href={`/${lang}/simulator`}>
        {lang === 'el' ? 'Δοκιμάστε το μόνοι σας στον προσομοιωτή →' : 'Try it yourself in the simulator →'}
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
</style>
