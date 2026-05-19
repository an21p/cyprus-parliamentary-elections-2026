<script lang="ts">
  import type { Lang } from '$data/types';
  import WorkedExampleStep from './WorkedExampleStep.svelte';
  import NicosiaQuotaPanel from './NicosiaQuotaPanel.svelte';
  import NicosiaFirstDistTable from './NicosiaFirstDistTable.svelte';
  import OtherDistrictsPanel from './OtherDistrictsPanel.svelte';
  import NationalUnusedStackedBars from './NationalUnusedStackedBars.svelte';

  type Props = {
    lang: Lang;
  };

  let { lang }: Props = $props();

  const stepLabel = $derived(
    lang === 'el' ? (n: number) => `Βήμα ${n} από 4` : (n: number) => `Step ${n} of 4`
  );

  const T = $derived({
    intro: {
      eyebrow: lang === 'el' ? 'Πραγματικό παράδειγμα' : 'Worked example',
      title:
        lang === 'el'
          ? 'Πώς κατανεμήθηκαν οι 20 έδρες της Λευκωσίας το 2021'
          : 'How the 20 Nicosia seats were allocated in 2021',
      lede:
        lang === 'el'
          ? 'Ένα βήμα-προς-βήμα παράδειγμα με πραγματικούς αριθμούς από το 2021, με το ίδιο σύστημα που θα εφαρμοστεί στις 24 Μαΐου 2026.'
          : 'A step-by-step example with real 2021 figures, using the same system that will be applied on 24 May 2026.'
    },
    s1: {
      title:
        lang === 'el'
          ? 'Υπολογίζουμε το εκλογικό μέτρο'
          : 'Compute the electoral quota',
      body: [
        lang === 'el'
          ? 'Σε κάθε επαρχία ο νόμος ξεκινά με μια απλή διαίρεση: <strong>έγκυροι ψήφοι ÷ έδρες</strong>. Στη Λευκωσία 122.347 έγκυροι ψήφοι ÷ 20 έδρες = <strong>6.117</strong> ψήφοι ανά έδρα (ο ακέραιος της διαίρεσης, αυτό λέγεται <em>Hare quota με αποκοπή</em>).'
          : 'In every district the law starts with a simple division: <strong>valid votes ÷ seats</strong>. In Nicosia, 122,347 valid votes ÷ 20 seats = <strong>6,117</strong> votes per seat (integer part; this is the <em>Hare quota with truncation</em>).',
        lang === 'el'
          ? 'Σκεφτείτε το ως «τιμή ανά έδρα»: για να κερδίσει μία έδρα στην 1η κατανομή ένα κόμμα πρέπει να μαζέψει 6.117 ψήφους.'
          : 'Think of it as the "price" of a seat: to win one seat in the first distribution a party needs to gather 6,117 votes.'
      ]
    },
    s2: {
      title:
        lang === 'el'
          ? 'Πόσες έδρες κερδίζει το κάθε κόμμα στην 1η κατανομή;'
          : 'How many seats does each party win in the first distribution?',
      body: [
        lang === 'el'
          ? 'Για κάθε λίστα: <strong>έδρες = ⌊ψήφοι ÷ 6.117⌋</strong>. Οι ψήφοι που περισσεύουν λέγονται <strong>αχρησιμοποίητες</strong>: <strong>αχρησιμοποίητες = ψήφοι − έδρες × 6.117</strong>.'
          : 'For each list: <strong>seats = ⌊votes ÷ 6,117⌋</strong>. The leftover is called <strong>unused votes</strong>: <strong>unused = votes − seats × 6,117</strong>.',
        lang === 'el'
          ? 'Σύνολο εδρών 1ης κατανομής: <strong>15 από 20</strong>. Οι υπόλοιπες 5 έδρες της Λευκωσίας δεν μένουν στην επαρχία· πάνε στην εθνική δεξαμενή.'
          : 'First-distribution total: <strong>15 of 20</strong>. The remaining 5 Nicosia seats do not stay in the district; they go to the national pool.'
      ]
    },
    s3: {
      title:
        lang === 'el'
          ? 'Η εθνική δεξαμενή κρίνεται από το πανεθνικό σύνολο αχρ. ψήφων'
          : 'The national pool runs on each party\'s nationwide unused total',
      body: [
        lang === 'el'
          ? 'Η ίδια διαδικασία της 1ης κατανομής επαναλαμβάνεται σε κάθε επαρχία. Για τη 2η κατανομή, η Κύπρος αντιμετωπίζεται ως <strong>μία περιφέρεια</strong>: αθροίζονται οι αχρ. ψήφοι κάθε κόμματος και από τις 6 επαρχίες, και ένα νέο μέτρο (συνολικές αχρ. ψήφοι ÷ έδρες που μένουν) αποδίδει εθνικές έδρες στα κόμματα που έχουν ξεπεράσει το 3,6%.'
          : 'The first-distribution procedure repeats in every district. For the second distribution, Cyprus is treated as <strong>a single constituency</strong>: each party\'s unused votes are summed across all six districts, and a new quota (total unused ÷ remaining seats) hands out national-pool seats to parties above the 3.6 % threshold.',
        lang === 'el'
          ? 'Πώς μοιράζονται μετά αυτές οι έδρες ξανά στις επαρχίες; Ο νόμος ορίζει: τα κόμματα <strong>κατατάσσονται κατά σειρά πανεθνικού αχρ. υπολοίπου</strong>. Με τη σειρά, καθένα παίρνει μία έδρα στην επαρχία όπου έχει το <strong>μεγαλύτερο αχρ. υπόλοιπό του</strong>, αν εκεί υπάρχει αδιάθετη έδρα· αλλιώς, στην επόμενη μεγαλύτερη. Η διαδικασία επαναλαμβάνεται για το επόμενο μεγαλύτερο αχρ. υπόλοιπο κάθε κόμματος, μέχρι να εξαντληθούν οι έδρες τους.'
          : 'How are those national-pool seats then placed back into districts? The law ranks parties by their <strong>nationwide unused total</strong>. Going down that ranking, each party gets one seat in the district where <em>it</em> has its <strong>largest unused remainder</strong>, provided that district still has an unfilled seat; otherwise it falls through to the next-largest. The pass repeats with each party\'s next-largest district, until every party\'s national-pool seats are placed.',
        lang === 'el'
          ? 'Στην περίπτωση του <strong>ΑΚΕΛ</strong>: με πανεθνικό αχρ. υπόλοιπο 23.395 ψήφων, κατατάχθηκε πρώτο. Οι μεγαλύτερες αχρ. ψήφοι του ήταν στην <strong>Πάφο</strong> (5.539), μετά στην Αμμόχωστο, Κερύνεια, Λεμεσό. Όταν έφτασε στη Λευκωσία, όπου είχε τις <em>λιγότερες</em> αχρ. ψήφους (1.302), όλες οι άλλες επαρχίες είχαν γεμίσει — έτσι <strong>δύο</strong> από τις εθνικές έδρες του ΑΚΕΛ προσγειώθηκαν στη Λευκωσία, παρότι δεν ήταν εκεί που είχε τη μεγαλύτερη «δύναμη» αχρ. ψήφων.'
          : 'For <strong>AKEL</strong>: with a nationwide unused total of 23,395 it was ranked first. AKEL\'s largest unused tallies were in <strong>Paphos</strong> (5,539), then Famagusta, Kyrenia, Limassol. By the time the algorithm got to Nicosia — where AKEL actually had the <em>smallest</em> unused, 1,302 — every other district had filled up. So <strong>two</strong> of AKEL\'s national-pool seats ended up landing in Nicosia, even though Nicosia was the weakest of its leftover piles.'
      ]
    },
    s4: {
      title:
        lang === 'el'
          ? 'Τελικό αποτέλεσμα: το ΑΚΕΛ παίρνει επιπλέον έδρα στη Λευκωσία'
          : 'Final result: AKEL gets an extra Nicosia seat',
      body: [
        lang === 'el'
          ? 'Στην τελική εικόνα της Λευκωσίας το 2021: <strong>ΔΗΣΥ 5, ΑΚΕΛ 6, ΔΗΚΟ 3, ΕΔΕΚ 1, Οικολόγοι 2, ΔΗΠΑ 2, ΕΛΑΜ 1</strong>. Το ΑΚΕΛ μπήκε στην 1η κατανομή με 4 έδρες· η 6η ήρθε από την εθνική αναδιανομή χάρη στις αχρησιμοποίητες ψήφους του.'
          : 'Final 2021 Nicosia outcome: <strong>DISY 5, AKEL 6, DIKO 3, EDEK 1, Ecologists 2, DIPA 2, ELAM 1</strong>. AKEL entered the first distribution with 4 seats; the 6th came from the national redistribution, earned by its unused votes.',
        lang === 'el'
          ? 'Αυτό είναι το βασικό χαρακτηριστικό του συστήματος: <strong>μια εθνική δύναμη μπορεί να κερδίσει έδρες σε επαρχίες όπου δεν έφτασε ποτέ το μέτρο</strong>, αρκεί να ξεπεράσει το όριο του 3,6% πανελλαδικά.'
          : 'This is the defining feature of the system: <strong>a nationally strong party can win seats in districts where it never reached the quota</strong>, as long as it has cleared the 3.6% nationwide threshold.'
      ]
    }
  });
</script>

<section class="narrative" aria-labelledby="worked-narrative-title">
  <header class="narrative-header">
    <p class="narrative-eyebrow">{T.intro.eyebrow}</p>
    <h2 id="worked-narrative-title" class="narrative-title">{T.intro.title}</h2>
    <p class="narrative-lede">{T.intro.lede}</p>
  </header>

  <WorkedExampleStep step={1} title={T.s1.title} eyebrow={stepLabel(1)}>
    {#snippet body()}
      <!-- eslint-disable svelte/no-at-html-tags -->
      <p>{@html T.s1.body[0]}</p>
      <p>{@html T.s1.body[1]}</p>
    {/snippet}
    {#snippet figure()}
      <NicosiaQuotaPanel {lang} />
    {/snippet}
  </WorkedExampleStep>

  <WorkedExampleStep step={2} title={T.s2.title} eyebrow={stepLabel(2)}>
    {#snippet body()}
      <p>{@html T.s2.body[0]}</p>
      <p>{@html T.s2.body[1]}</p>
    {/snippet}
    {#snippet figure()}
      <NicosiaFirstDistTable {lang} />
    {/snippet}
  </WorkedExampleStep>

  <WorkedExampleStep step={3} title={T.s3.title} eyebrow={stepLabel(3)}>
    {#snippet body()}
      {#each T.s3.body as p}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        <p>{@html p}</p>
      {/each}
    {/snippet}
    {#snippet figure()}
      <div class="s3-stack">
        <NationalUnusedStackedBars {lang} />
        <OtherDistrictsPanel {lang} />
      </div>
    {/snippet}
  </WorkedExampleStep>

  <WorkedExampleStep step={4} title={T.s4.title} eyebrow={stepLabel(4)}>
    {#snippet body()}
      <p>{@html T.s4.body[0]}</p>
      <p>{@html T.s4.body[1]}</p>
    {/snippet}
  </WorkedExampleStep>
</section>

<style>
  .narrative {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .narrative-header {
    max-width: var(--max-prose);
    margin-bottom: var(--sp-5);
  }

  .narrative-eyebrow {
    margin: 0 0 var(--sp-2);
    font-family: var(--font-sans);
    font-size: var(--fs-50);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--color-accent);
    font-weight: 700;
  }

  .narrative-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--fs-500);
    font-weight: 600;
    line-height: var(--lh-tight);
    letter-spacing: var(--tracking-snug);
    color: var(--color-ink);
    text-wrap: balance;
  }

  .narrative-lede {
    margin: var(--sp-3) 0 0;
    font-family: var(--font-sans);
    font-size: var(--fs-200);
    line-height: var(--lh-relaxed);
    color: var(--color-ink-2);
    max-width: 56ch;
  }

  .s3-stack {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }
</style>
