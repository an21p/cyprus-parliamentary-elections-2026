<script lang="ts">
  import { PageShell, SectionBlock, Callout } from '$components/layout';
  import { CyprusMap, DistrictTable } from '$components/map';

  let { data } = $props();
  const lang = $derived(data.lang);
  const currentPath = $derived(data.currentPath);
</script>

<PageShell
  {lang}
  {currentPath}
  numeral="6"
  eyebrow={lang === 'el' ? 'Γεωγραφία' : 'Geography'}
  title={lang === 'el' ? 'Οι έξι επαρχίες' : 'The six districts'}
  lede={lang === 'el'
    ? 'Λευκωσία, Λεμεσός, Αμμόχωστος, Λάρνακα, Πάφος, Κερύνεια. Από το 2026, η Πάφος κερδίζει μία έδρα και η Λευκωσία χάνει μία.'
    : 'Nicosia, Limassol, Famagusta, Larnaca, Paphos, Kyrenia. From 2026, Paphos gains a seat and Nicosia loses one.'}
>
  <SectionBlock
    id="map"
    eyebrow={lang === 'el' ? 'Χάρτης' : 'Map'}
    title={lang === 'el' ? 'Η Κύπρος σε έξι επαρχίες' : 'Cyprus by district'}
  >
    <p>
      {#if lang === 'el'}
        Περάστε με τον δείκτη πάνω από κάθε επαρχία (ή χρησιμοποιήστε πληκτρολόγιο) για να δείτε <strong>έδρες</strong>, <strong>εγγεγραμμένους ψηφοφόρους</strong> και τον <strong>αριθμό σταυρών προτίμησης</strong>. Οι ενδείξεις <strong>+1 / −1</strong> σηματοδοτούν την αλλαγή κατανομής που ισχύει <strong>για πρώτη φορά το 2026</strong>.
      {:else}
        Hover over each district (or use keyboard navigation) to see <strong>seats</strong>, <strong>registered voters</strong> and <strong>preference-cross allowance</strong>. The <strong>+1 / −1</strong> badges mark the reallocation that takes effect <strong>for the first time in 2026</strong>.
      {/if}
    </p>
    <CyprusMap {lang} />
  </SectionBlock>

  <SectionBlock
    id="swap"
    eyebrow={lang === 'el' ? 'Νέο για το 2026' : 'New for 2026'}
    title={lang === 'el' ? 'Η ανταλλαγή Πάφου / Λευκωσίας' : 'The Paphos / Nicosia swap'}
  >
    <Callout tone="fact">
      {#if lang === 'el'}
        <strong>Νόμος Οκτωβρίου 2025:</strong> η Λευκωσία πέφτει από <strong>20 σε 19 έδρες</strong>, η Πάφος ανεβαίνει από <strong>4 σε 5</strong>. Συνολικός αριθμός εδρών αμετάβλητος: <strong>56</strong>.
      {:else}
        <strong>October 2025 redistribution law:</strong> Nicosia drops from <strong>20 to 19 seats</strong>, Paphos rises from <strong>4 to 5</strong>. The total of <strong>56 seats</strong> remains unchanged.
      {/if}
    </Callout>
    <p>
      {#if lang === 'el'}
        Η ανακατανομή έγινε βάσει των ανανεωμένων εκλογικών καταλόγων: η Λευκωσία συγκεντρώνει σήμερα <strong>198.376</strong> εγγεγραμμένους, ενώ η Πάφος έχει φτάσει τους <strong>47.429</strong>, αρκετά πάνω από το όριο για την πέμπτη της έδρα. Είναι η <strong>πιο ουσιαστική δομική αλλαγή</strong> του εκλογικού γεωγραφικού χάρτη από την επέκταση της Βουλής στη δεκαετία του 1980. Ο αριθμός των σταυρών στη Λευκωσία παραμένει στους <strong>5</strong> (βάσει του τύπου «ένας σταυρός ανά τέσσερις έδρες, στρογγυλοποίηση προς τα πάνω»), αλλά κάθε υποψήφιος της πρωτεύουσας πλέον συναγωνίζεται για <strong>μία λιγότερη έδρα</strong> από το 2021.
      {:else}
        The redistribution followed updated voter rolls: Nicosia now has <strong>198,376</strong> registered voters, while Paphos has reached <strong>47,429</strong>, comfortably above the threshold for a fifth seat. It is the <strong>most consequential structural change</strong> to the electoral map since the expansion of the House in the 1980s. The number of preference crosses in Nicosia stays at <strong>5</strong> (one cross per four seats, rounded up), but every Nicosia candidate now competes for <strong>one fewer seat</strong> than in 2021.
      {/if}
    </p>
  </SectionBlock>

  <SectionBlock
    id="per-district"
    eyebrow={lang === 'el' ? 'Επαρχία προς επαρχία' : 'District by district'}
    title={lang === 'el' ? 'Στοιχεία ανά επαρχία' : 'Per-district facts'}
  >
    <p>
      {#if lang === 'el'}
        Διαβάστε τον πίνακα σε δύο επίπεδα. <strong>Πρώτο, το μέγεθος της επαρχίας</strong>: η Λευκωσία με <strong>19 έδρες</strong> ακολουθεί απλά την αναλογική, ενώ η Κερύνεια με μόνο <strong>3 έδρες</strong> έχει εξαιρετικά υψηλό μέτρο. Το 2021, <strong>κανένα κόμμα</strong> στην Κερύνεια δεν έφτασε το μέτρο, και οι 3 έδρες κρίθηκαν στην εθνική δεξαμενή. <strong>Δεύτερο, ο αριθμός των σταυρών προτίμησης</strong>: υπολογίζεται με τον τύπο «<em>ένας σταυρός ανά τέσσερις έδρες, στρογγυλοποίηση προς τα πάνω</em>».
      {:else}
        Read the table on two levels. <strong>First, district size</strong>: Nicosia with <strong>19 seats</strong> follows simple proportionality, while Kyrenia with just <strong>3 seats</strong> has an extremely high quota. In 2021, <strong>no party</strong> in Kyrenia reached the quota at all, and all three Kyrenia seats were decided in the national pool. <strong>Second, the preference-cross allowance</strong>: it follows the rule "<em>one cross per four seats, rounded up</em>".
      {/if}
    </p>
    <DistrictTable {lang} />
  </SectionBlock>
</PageShell>
