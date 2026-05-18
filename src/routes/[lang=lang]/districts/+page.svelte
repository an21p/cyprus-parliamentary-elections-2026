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
      {lang === 'el'
        ? 'Περάστε με τον δείκτη πάνω από κάθε επαρχία (ή χρησιμοποιήστε πληκτρολόγιο) για να δείτε έδρες, εγγεγραμμένους ψηφοφόρους και τον αριθμό σταυρών προτίμησης. Οι ενδείξεις +1 / −1 σηματοδοτούν την αλλαγή κατανομής που ισχύει για πρώτη φορά το 2026.'
        : 'Hover over each district (or use keyboard navigation) to see seats, registered voters and preference-cross allowance. The +1 / −1 badges mark the reallocation that takes effect for the first time in 2026.'}
    </p>
    <CyprusMap {lang} />
  </SectionBlock>

  <SectionBlock
    id="swap"
    eyebrow={lang === 'el' ? 'Νέο για το 2026' : 'New for 2026'}
    title={lang === 'el' ? 'Η ανταλλαγή Πάφου / Λευκωσίας' : 'The Paphos / Nicosia swap'}
  >
    <Callout tone="fact">
      {lang === 'el'
        ? 'Νόμος Οκτωβρίου 2025: η Λευκωσία πέφτει από 20 σε 19 έδρες, η Πάφος ανεβαίνει από 4 σε 5. Συνολικός αριθμός εδρών αμετάβλητος: 56.'
        : 'October 2025 redistribution law: Nicosia drops from 20 to 19 seats, Paphos rises from 4 to 5. The total of 56 seats remains unchanged.'}
    </Callout>
    <p>
      {lang === 'el'
        ? 'Η ανακατανομή έγινε βάσει των ανανεωμένων εκλογικών καταλόγων: η Λευκωσία συγκεντρώνει σήμερα 198.376 εγγεγραμμένους, ενώ η Πάφος έχει φτάσει τους 47.429, αρκετά πάνω από το όριο για την πέμπτη της έδρα. Είναι η πιο ουσιαστική δομική αλλαγή του εκλογικού γεωγραφικού χάρτη από την επέκταση της Βουλής στη δεκαετία του 1980 — μειώνει τον αριθμό των σταυρών στη Λευκωσία από 5 σε 5 (παραμένει ίδιος βάσει του τύπου «ένας σταυρός ανά τέσσερις έδρες, στρογγυλοποίηση προς τα πάνω»), αλλά αλλάζει τα δεδομένα του κάθε υποψηφίου της πρωτεύουσας.'
        : 'The redistribution followed updated voter rolls: Nicosia now has 198,376 registered voters, while Paphos has reached 47,429 — comfortably above the threshold for a fifth seat. It is the most consequential structural change to the electoral map since the expansion of the House in the 1980s. The number of preference crosses in Nicosia stays at 5 (one cross per four seats, rounded up), but every Nicosia candidate now competes for one fewer seat than in 2021.'}
    </p>
  </SectionBlock>

  <SectionBlock
    id="per-district"
    eyebrow={lang === 'el' ? 'Επαρχία προς επαρχία' : 'District by district'}
    title={lang === 'el' ? 'Στοιχεία ανά επαρχία' : 'Per-district facts'}
  >
    <p>
      {lang === 'el'
        ? 'Διαβάστε τον πίνακα σε δύο επίπεδα. Πρώτο: το μέγεθος της επαρχίας — η Λευκωσία με 19 έδρες ακολουθεί απλά την αναλογική, ενώ η Κερύνεια με μόνο 3 έδρες έχει εξαιρετικά υψηλό μέτρο. Το 2021, κανένα κόμμα στην Κερύνεια δεν έφτασε το μέτρο, και οι 3 έδρες κρίθηκαν στην εθνική δεξαμενή. Δεύτερο: ο αριθμός των σταυρών προτίμησης δεν είναι αυθαίρετος — υπολογίζεται με τον τύπο «ένας σταυρός ανά τέσσερις έδρες, στρογγυλοποίηση προς τα πάνω».'
        : 'Read the table on two levels. First, district size: Nicosia with 19 seats follows simple proportionality, while Kyrenia with just 3 seats has an extremely high quota. In 2021, no party in Kyrenia reached the quota at all, and all three Kyrenia seats were decided in the national pool. Second, the preference-cross allowance is not arbitrary — it follows the rule "one cross per four seats, rounded up".'}
    </p>
    <DistrictTable {lang} />
  </SectionBlock>
</PageShell>
