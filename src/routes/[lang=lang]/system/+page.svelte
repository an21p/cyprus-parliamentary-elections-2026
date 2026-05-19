<script lang="ts">
  import { PageShell, SectionBlock, Callout, KMath } from '$components/layout';
  import { BallotPreview } from '$components/map';

  let { data } = $props();
  const lang = $derived(data.lang);
  const currentPath = $derived(data.currentPath);
</script>

<PageShell
  {lang}
  {currentPath}
  numeral="3.6"
  eyebrow={lang === 'el' ? 'Πώς λειτουργεί' : 'How it works'}
  title={lang === 'el' ? 'Το εκλογικό σύστημα της Κύπρου' : 'The Cypriot electoral system'}
  lede={lang === 'el'
    ? 'Ενισχυμένη αναλογική σε τρεις φάσεις: επαρχιακή κατανομή με μέτρο Hare, εθνική δεξαμενή με όριο 3,6%, και υπόλοιπες έδρες με όριο 7,2%.'
    : 'Reinforced proportional representation across three stages: a district Hare quota, a 3.6% national pool, then a 7.2% residual.'}
>
  <SectionBlock
    id="overview"
    eyebrow={lang === 'el' ? 'Επισκόπηση' : 'Overview'}
    title={lang === 'el' ? '56 έδρες, 6 επαρχίες' : '56 seats, 6 districts'}
  >
    <p>
      {#if lang === 'el'}
        Το <strong>Σύνταγμα του 1960</strong> όρισε τη Βουλή των Αντιπροσώπων σε <strong>50 έδρες</strong>, 35 για Ελληνοκύπριους και 15 για Τουρκοκύπριους. Μετά την αποχώρηση των Τουρκοκυπρίων από τους θεσμούς της Δημοκρατίας το <strong>1963–64</strong>, η Βουλή λειτουργεί αποκλειστικά με τους Ελληνοκυπρίους εκπροσώπους.
      {:else}
        The <strong>1960 Constitution</strong> set the House of Representatives at <strong>50 seats</strong>: 35 Greek-Cypriot and 15 Turkish-Cypriot. After Turkish Cypriots withdrew from the institutions of the Republic in <strong>1963–64</strong>, the House has operated with the Greek-Cypriot benches alone.
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        Το <strong>1985</strong>, υπό το λεγόμενο <strong>«δόγμα της ανάγκης»</strong>, με κοινό νόμο διευρύνθηκε η Βουλή στις <strong>80 έδρες</strong> (56 Ελληνοκύπριοι + 24 Τουρκοκύπριοι). Οι <strong>24 τουρκοκυπριακές έδρες</strong> παραμένουν κενές. Έτσι, στις εκλογές της <strong>24ης Μαΐου 2026</strong>, οι ψηφοφόροι θα κρίνουν στην πράξη <strong>56 έδρες</strong>.
      {:else}
        In <strong>1985</strong>, under the so-called <strong>"doctrine of necessity"</strong>, ordinary law enlarged the House to <strong>80 seats</strong> (56 Greek-Cypriot + 24 Turkish-Cypriot). The <strong>24 Turkish-Cypriot seats</strong> have stayed vacant ever since. So on <strong>24 May 2026</strong> voters will fill <strong>56 seats</strong> in practice.
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        Πέρα από τους βουλευτές, το σύστημα προβλέπει επίσης <strong>τρεις θρησκευτικούς εκπροσώπους</strong> (Αρμενίων, Μαρωνιτών και Λατίνων), οι οποίοι μετέχουν στη Βουλή <strong>χωρίς δικαίωμα ψήφου</strong>. Από την απόφαση <strong>Aziz κατά Κύπρου</strong> (ΕΔΔΑ, 2004), οι Τουρκοκύπριοι μόνιμοι κάτοικοι των ελεύθερων περιοχών μπορούν να εγγραφούν στους ελληνοκυπριακούς εκλογικούς καταλόγους· το 2026 είναι <strong>859</strong> από συνολικά <strong>568.587</strong> εγγεγραμμένους ψηφοφόρους.
      {:else}
        Beyond the deputies, three <strong>religious-group representatives</strong> (Armenian, Maronite and Latin) sit in the House <strong>without voting rights</strong>. Since the European Court of Human Rights judgment in <strong>Aziz v. Cyprus</strong> (2004), Turkish Cypriots resident in the government-controlled areas may register on the Greek-Cypriot roll; in 2026, <strong>859</strong> are registered out of <strong>568,587</strong> total voters.
      {/if}
    </p>
  </SectionBlock>

  <SectionBlock
    id="first-distribution"
    eyebrow={lang === 'el' ? 'Φάση 1' : 'Stage 1'}
    title={lang === 'el' ? 'Πρώτη κατανομή: επαρχιακό μέτρο Hare' : 'First distribution: district Hare quota'}
  >
    <p>
      {#if lang === 'el'}
        Σε κάθε μία από τις <strong>έξι επαρχίες</strong>, η κατανομή ξεκινά με έναν απλό υπολογισμό: το <strong>εκλογικό μέτρο</strong>. Διαιρούμε τους έγκυρους ψήφους της επαρχίας με τις έδρες που της αναλογούν, και κρατάμε μόνο τον ακέραιο. Κάθε κόμμα κερδίζει τόσες έδρες όσες φορές χωράει το μέτρο στις ψήφους του, πάλι παίρνοντας τον ακέραιο.
      {:else}
        In each of the <strong>six districts</strong>, allocation begins with one calculation: the <strong>electoral quota</strong>. Divide the district's valid votes by the seats it is awarded, keeping only the integer. Each party wins as many seats as the quota fits into its vote total, again integer only.
      {/if}
    </p>
    <Callout tone="fact" title={lang === 'el' ? 'Ο τύπος' : 'The formula'}>
      <dl class="formula-list">
        <dt>{lang === 'el' ? 'εκλογικό μέτρο' : 'electoral quota'}</dt>
        <dd>
          <KMath
            expr={'=\\; \\left\\lfloor \\dfrac{\\text{valid votes}}{\\text{seats}} \\right\\rfloor'}
          />
        </dd>
        <dt>{lang === 'el' ? 'έδρες κόμματος' : 'party seats'}</dt>
        <dd>
          <KMath
            expr={'=\\; \\left\\lfloor \\dfrac{\\text{party votes}}{\\text{quota}} \\right\\rfloor'}
          />
        </dd>
        <dt>{lang === 'el' ? 'αχρ. ψήφοι' : 'unused'}</dt>
        <dd>
          <KMath
            expr={'=\\; \\text{party votes} \\,-\\, \\text{party seats} \\times \\text{quota}'}
          />
        </dd>
      </dl>
      <p class="math-legend-line">
        {#if lang === 'el'}
          Το <KMath expr={'\\lfloor \\,\\cdot\\, \\rfloor'} /> «πατώνει» τη διαίρεση στον αμέσως μικρότερο ακέραιο.
        {:else}
          The <KMath expr={'\\lfloor \\,\\cdot\\, \\rfloor'} /> brackets round the division down to the nearest whole number.
        {/if}
      </p>
    </Callout>
    <p>
      {#if lang === 'el'}
        Παράδειγμα από την <strong>Κερύνεια το 2021</strong>: 17.556 έγκυροι ψήφοι ÷ 3 έδρες = <strong>μέτρο 5.852</strong>. Κανένα κόμμα δεν έφτασε αυτό το μέτρο, καθώς το μεγαλύτερο (ΑΚΕΛ) έλαβε μόνο <strong>4.296 ψήφους</strong>. Αποτέλεσμα: <strong>μηδέν έδρες</strong> κατανέμονται στην πρώτη φάση και οι τρεις έδρες της Κερύνειας διεκδικούνται όλες στην εθνική δεξαμενή.
      {:else}
        Take <strong>Kyrenia in 2021</strong>: 17,556 valid votes ÷ 3 seats = a <strong>quota of 5,852</strong>. No party reached it (the largest, AKEL, polled <strong>4,296</strong>). So <strong>zero seats</strong> were awarded in stage 1, and all three Kyrenia seats were contested in the national pool.
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        Οι <strong>«αχρησιμοποίητες ψήφοι»</strong> (οι ψήφοι κάθε κόμματος που δεν αρκούσαν για ακόμη μία έδρα) είναι το νόμισμα που μεταφέρεται στις επόμενες φάσεις. Γενικά, σχεδόν κάθε εκλογή αφήνει <strong>12–18 έδρες ανοικτές</strong> μετά την πρώτη κατανομή.
      {:else}
        The <strong>"unused votes"</strong> (each party's remainder, the votes that did not stretch to another seat) become the currency carried into the next stages. In practice, almost every election leaves <strong>12–18 seats unfilled</strong> after the first distribution.
      {/if}
    </p>
  </SectionBlock>

  <SectionBlock
    id="second-distribution"
    eyebrow={lang === 'el' ? 'Φάση 2' : 'Stage 2'}
    title={lang === 'el' ? 'Δεύτερη κατανομή: εθνική δεξαμενή με όριο 3,6%' : 'Second distribution: national pool with 3.6% threshold'}
  >
    <p>
      {#if lang === 'el'}
        Όλη η Κύπρος αντιμετωπίζεται ως <strong>μία ενιαία περιφέρεια</strong>. Αθροίζονται οι αχρησιμοποίητες ψήφοι των κομμάτων που πέρασαν το όριο και υπολογίζεται ένα <strong>νέο εθνικό μέτρο</strong>: σύνολο αχρησιμοποίητων ψήφων ÷ έδρες που παραμένουν κενές. Κάθε δικαιούμενο κόμμα παίρνει τόσες επιπλέον έδρες όσες χωράει το εθνικό μέτρο στις αχρησιμοποίητες ψήφους του.
      {:else}
        All of Cyprus is treated as a <strong>single constituency</strong>. The unused votes of qualifying lists are summed and divided by the seats that remain unfilled, producing a <strong>second-stage quota</strong>. Each qualifying list wins as many extra seats as that quota fits into its national unused-vote total.
      {/if}
    </p>
    <Callout tone="info" title={lang === 'el' ? 'Τα όρια εισόδου' : 'The participation thresholds'}>
      <p>
        {#if lang === 'el'}
          <strong>Μονό κόμμα: 3,6%</strong>. <strong>Συνασπισμός δύο κομμάτων: 10%</strong>. <strong>Συνασπισμός τριών ή περισσοτέρων: 20%</strong>. Όλα τα ποσοστά επί του πανεθνικού έγκυρου ψήφου.
        {:else}
          <strong>Single party: 3.6%</strong>. <strong>Two-party coalition: 10%</strong>. <strong>Coalition of three or more parties: 20%</strong>. All percentages are of the nationwide valid vote.
        {/if}
      </p>
      <p>
        {#if lang === 'el'}
          Το όριο της <strong>Φάσης 3</strong> (υπολειπόμενες έδρες) είναι <strong>7,2%</strong>.
        {:else}
          The threshold for <strong>stage 3</strong> (residual seats) is <strong>7.2%</strong>.
        {/if}
      </p>
    </Callout>
    <p>
      {#if lang === 'el'}
        Το ενιαίο όριο του <strong>3,6%</strong> ψηφίστηκε με τη <strong>μεταρρύθμιση του 2015</strong> και διπλασίασε το προηγούμενο όριο του <strong>1,8%</strong> (≈ 1/56 των εγκύρων). Στόχος ήταν να περιοριστεί ο κατακερματισμός, αλλά όπως σημειώνει η επιστημονική βιβλιογραφία η αλλαγή «δεν απέτρεψε ένα έντονα κατακερματισμένο κοινοβούλιο».
      {:else}
        The unified <strong>3.6%</strong> bar was introduced by the <strong>2015 reform</strong>, doubling the previous <strong>1.8%</strong> threshold (≈ 1/56 of valid votes). The intent was to limit fragmentation; the academic literature notes the change "did not avert a highly fragmented parliament".
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        Συνέπεια: μία λίστα που έλαβε <strong>3,27%</strong> πανεθνικά (όπως οι <strong>Κυνηγοί το 2021</strong> με 11.712 ψήφους) αποκλείστηκε πλήρως. Όλες της οι ψήφοι <strong>μηδενίστηκαν</strong> στις επόμενες κατανομές, παρότι ξεπέρασε άλλα έξι κόμματα στην κάλπη. Συνολικά, περίπου <strong>15.000 ψήφοι</strong> για υπο-όριο λίστες απορρίφθηκαν εκείνο το βράδυ.
      {:else}
        The consequence: a list polling <strong>3.27%</strong> nationally (like the <strong>Hunters in 2021</strong>, with 11,712 votes) was excluded entirely. All of its votes were <strong>wiped from the later stages</strong>, even though it outpolled six other lists at the ballot box. In total, roughly <strong>15,000 sub-threshold votes</strong> were discarded on the night.
      {/if}
    </p>
  </SectionBlock>

  <SectionBlock
    id="third-distribution"
    eyebrow={lang === 'el' ? 'Φάση 3' : 'Stage 3'}
    title={lang === 'el' ? 'Τρίτη κατανομή: υπόλοιπες έδρες με όριο 7,2%' : 'Third distribution: residual seats with 7.2% threshold'}
  >
    <p>
      {#if lang === 'el'}
        Αν μετά τη δεύτερη κατανομή παραμείνουν κενές έδρες (πράγμα συνηθισμένο, καθώς το εθνικό μέτρο δίνει ακέραιες έδρες και αφήνει πάλι υπόλοιπα), οι έδρες αυτές δίνονται με σειρά κατάταξης στα κόμματα με τις <strong>περισσότερες εναπομείνασες αχρησιμοποίητες ψήφους</strong>. Στη φάση αυτή δικαιούνται συμμετοχή <strong>μόνο τα κόμματα με πανεθνικό ποσοστό τουλάχιστον 7,2%</strong>.
      {:else}
        If seats are still unfilled after stage 2 (typical, because the national quota also produces remainders), they are awarded by ranking the parties with the <strong>largest leftover unused votes</strong>. <strong>Only lists that cleared 7.2% nationally</strong> are eligible at this stage.
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        Έτσι ένα κόμμα μπορεί να συμμετέχει στη <strong>Φάση 2 (όριο 3,6%)</strong> αλλά να αποκλειστεί από τη <strong>Φάση 3 (όριο 7,2%)</strong>: παίρνει ό,τι μπορεί στη δεύτερη φάση και αποσύρεται από την τρίτη.
      {:else}
        A party can thus take part in <strong>stage 2 (3.6% bar)</strong> but be excluded from <strong>stage 3 (7.2% bar)</strong>: it picks up what it can in the second round and steps out for the third.
      {/if}
    </p>
  </SectionBlock>

  <SectionBlock
    id="back-to-districts"
    eyebrow={lang === 'el' ? 'Επανακατανομή' : 'Allocation back to districts'}
    title={lang === 'el' ? 'Πώς γυρίζουν οι εθνικές έδρες στις επαρχίες' : 'How national seats come back to districts'}
  >
    <p>
      {#if lang === 'el'}
        Οι έδρες που κερδίζονται στη δεύτερη και τρίτη κατανομή πρέπει να αντιστοιχιστούν σε συγκεκριμένες επαρχίες. Ο νόμος ορίζει δύο ξεχωριστές διαδικασίες — μία για τη φάση 2 και μία για τη φάση 3 — σύμφωνα με την επίσημη σελίδα του <strong>Υπουργείου Εσωτερικών</strong>.
      {:else}
        Seats won in stages 2 and 3 must be placed back in specific districts. The law sets out two distinct procedures — one for stage 2 and one for stage 3 — per the <strong>Ministry of Interior's</strong> official page.
      {/if}
    </p>

    <Callout
      tone="info"
      title={lang === 'el' ? 'Φάση 2 — κυκλικά κατά πανεθνικό αχρ. υπόλοιπο' : 'Stage 2 — round-robin by nationwide unused remainder'}
    >
      <p>
        {#if lang === 'el'}
          Τα κόμματα <strong>κατατάσσονται κατά το πανεθνικό άθροισμα αχρ. ψήφων τους</strong> (φθίνουσα σειρά). Σε κάθε «γύρο», κάθε κόμμα — με τη σειρά κατάταξης — τοποθετεί <strong>μία έδρα</strong> στην επαρχία όπου έχει το <em>μεγαλύτερο</em> αχρ. υπόλοιπό του, εφόσον εκεί υπάρχει αδιάθετη έδρα. Αν η επαρχία είναι γεμάτη, πάει στην επόμενη μεγαλύτερη. Στον επόμενο γύρο, κάθε κόμμα προχωρά στην <em>επόμενη</em> μεγαλύτερη του επαρχία. Η διαδικασία επαναλαμβάνεται μέχρι να τοποθετηθούν όλες οι έδρες φάσης 2.
        {:else}
          Parties are <strong>ranked descending by their nationwide unused total</strong>. In pass 1, each party (in rank order) places <strong>one seat</strong> in the district where it has its <em>largest</em> unused remainder, provided that district still has an unfilled seat; if not, it falls through to its next-largest. Pass 2 advances every party to its <em>next-largest</em> unused district, and so on, until every party's stage-2 quota is placed.
        {/if}
      </p>
    </Callout>

    <Callout
      tone="info"
      title={lang === 'el' ? 'Φάση 3 — μία-μία, κατά υπόλοιπο μετά τη φάση 2' : 'Stage 3 — one by one, by post-stage-2 remainder'}
    >
      <p>
        {#if lang === 'el'}
          Οι εναπομείνασες έδρες δίνονται <strong>μία προς μία</strong>: κάθε φορά παίρνει σειρά το κόμμα με το μεγαλύτερο <em>νέο</em> υπόλοιπο (αχρ. ψήφοι μείον έδρες×μέτρο φάσης 2), εφόσον είναι πάνω από το 7,2%. Η έδρα τοποθετείται στην επαρχία όπου το κόμμα έχει τη μεγαλύτερη αχρ. ψήφο και υπάρχει διαθέσιμη έδρα.
        {:else}
          Residual seats are awarded <strong>one at a time</strong> to the qualifying party (≥ 7.2 %) with the largest <em>new</em> remainder (national unused − seats × stage-2 quota), placed in that party's highest stage-1 unused district that still has capacity.
        {/if}
      </p>
    </Callout>

    <p>
      {#if lang === 'el'}
        Αποτέλεσμα: ένα κόμμα μπορεί να μην έφτασε το επαρχιακό μέτρο σε <strong>καμία</strong> επαρχία, και όμως να καταλήξει με έδρες σε αρκετές επαρχίες, αν το πανεθνικό του ποσοστό πέρασε το <strong>3,6%</strong>. Ταυτόχρονα, μπορεί να καταλήξει με έδρες σε επαρχίες που <strong>δεν</strong> είχε τις περισσότερες αχρ. ψήφους — απλώς γιατί όταν ήρθε η σειρά του, οι «καλύτερες» επαρχίες είχαν ήδη γεμίσει.
      {:else}
        The upshot: a party may not have reached the quota in <strong>any</strong> district and still end up with seats in several, provided its national share cleared <strong>3.6 %</strong>. Equally, it can end up with seats in districts where it did <strong>not</strong> have its highest unused pile — simply because by the time it picked, the "better" districts were full. (This is exactly how AKEL ended up with two Nicosia reassignment seats in 2021 despite Nicosia being its <em>smallest</em> unused pile.)
      {/if}
    </p>

    <Callout
      tone="fact"
      title={lang === 'el' ? 'Πηγή: Υπουργείο Εσωτερικών' : 'Source: Ministry of Interior'}
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
        —
        {lang === 'el'
          ? 'η μοναδική δημόσια πηγή που περιγράφει αναλυτικά τη διαδικασία ανά γύρο.'
          : 'the only public source that describes the round-by-round placement procedure in detail.'}
      </p>
    </Callout>
  </SectionBlock>

  <SectionBlock
    id="ballot"
    eyebrow={lang === 'el' ? 'Στην κάλπη' : 'At the ballot box'}
    title={lang === 'el' ? 'Η ψηφοφορία στην πράξη' : 'How voting actually works'}
  >
    <p>
      {#if lang === 'el'}
        Κάθε επαρχία έχει το δικό της χρώμα ψηφοδελτίου: <strong>λευκό</strong> για τη Λευκωσία, <strong>κίτρινο</strong> για τη Λεμεσό, <strong>μπλε</strong> για την Αμμόχωστο, <strong>ροζ</strong> για τη Λάρνακα, <strong>πράσινο</strong> για την Πάφο, <strong>πορτοκαλί</strong> για την Κερύνεια. Στη Λευκωσία, με <strong>19 λίστες και 19 έδρες</strong>, το ψηφοδέλτιο εκτείνεται σε δύο διπλωμένα φύλλα. Μόνο η Λάρνακα έχει μονόπλευρο ψηφοδέλτιο.
      {:else}
        Every district has its own ballot colour: <strong>white</strong> for Nicosia, <strong>yellow</strong> for Limassol, <strong>blue</strong> for Famagusta, <strong>pink</strong> for Larnaca, <strong>green</strong> for Paphos, <strong>orange</strong> for Kyrenia. In Nicosia, with <strong>19 lists and 19 seats</strong>, the ballot extends over two folded sheets. Only Larnaca uses a single-sided ballot.
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        Στο κάτω μέρος κάθε στήλης υπάρχει το <strong>κουτάκι του κόμματος</strong>, που σημειώνεται με <strong>«Χ», «+» ή «✔»</strong>. Κάθε άλλο σημάδι ακυρώνει το ψηφοδέλτιο. Δίπλα σε κάθε υποψήφιο υπάρχει μικρότερο κουτάκι: ο ψηφοφόρος δικαιούται μέχρι <strong>έναν σταυρό προτίμησης για κάθε τέσσερις έδρες</strong> της επαρχίας του, στρογγυλοποιημένα προς τα πάνω. Οι σταυροί είναι <strong>προαιρετικοί</strong>· μία απλή ψήφος κόμματος μετράει κανονικά.
      {:else}
        At the bottom of every column is the <strong>party box</strong>, marked with <strong>"X", "+" or "✔"</strong>. Any other mark invalidates the ballot. Beside each candidate is a smaller box: a voter may mark up to <strong>one preference cross for every four seats</strong> in the district, rounded up. Crosses are <strong>optional</strong>; a plain party vote counts.
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        Οι σταυροί επιτρέπονται <strong>μόνο εντός της λίστας που ψηφίστηκε</strong>: αν ο ψηφοφόρος βάλει σταυρούς σε δύο διαφορετικά κόμματα, το ψηφοδέλτιο <strong>ακυρώνεται</strong>. Οι αρχηγοί κομμάτων και οι επικεφαλής συνασπισμών <strong>αυτόματα</strong> κερδίζουν σταυρούς ίσους με τη συνολική ψήφο της λίστας· δεν χρειάζεται ο ψηφοφόρος να τους σημειώσει χωριστά. Το 2026 εξαιρούνται με αυτό τον τρόπο, μεταξύ άλλων, η <strong>Αννίτα Δημητρίου</strong> (ΔΗΣΥ), ο <strong>Στέφανος Στεφάνου</strong> (ΑΚΕΛ), ο <strong>Νικόλας Παπαδόπουλος</strong> (ΔΗΚΟ), ο <strong>Χρήστος Χρήστου</strong> (ΕΛΑΜ) και ο <strong>Οδυσσέας Μιχαηλίδης</strong> (ΑΛΜΑ).
      {:else}
        Crosses are <strong>only valid within the list you voted</strong>: if a voter marks crosses on two different lists, the ballot is <strong>invalid</strong>. Party leaders and coalition heads <strong>automatically</strong> receive crosses equal to the list's total vote; voters do not need to mark them. For 2026 those exempted include <strong>Annita Demetriou</strong> (DISY), <strong>Stefanos Stefanou</strong> (AKEL), <strong>Nicolas Papadopoulos</strong> (DIKO), <strong>Christos Christou</strong> (ELAM) and <strong>Odysseas Michaelides</strong> (ALMA).
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        Στην κάθε λίστα οι έδρες που κερδήθηκαν στην επαρχία πάνε στους υποψηφίους με τους <strong>περισσότερους προσωπικούς σταυρούς</strong>. Οι σταυροί επομένως έχουν σημασία όχι για το <em>ποιο κόμμα</em> μπαίνει στη Βουλή αλλά για το <em>ποιοι υποψήφιοί του</em> εκλέγονται.
      {:else}
        Within each list the seats won in the district go to the candidates with the <strong>most personal crosses</strong>. Preference crosses therefore do not decide <em>which list</em> enters parliament; they decide <em>which of its candidates</em> are elected.
      {/if}
    </p>

    <BallotPreview districtId="NIC" {lang} />
  </SectionBlock>

  <SectionBlock
    id="simulator-approximation"
    eyebrow={lang === 'el' ? 'Στον προσομοιωτή' : 'In the simulator'}
    title={lang === 'el'
      ? 'Από πανεθνικά ποσοστά σε ψήφους ανά επαρχία'
      : 'From national shares to district votes'}
  >
    <p>
      {#if lang === 'el'}
        Οι δημοσκοπήσεις δίνουν <strong>ένα ποσοστό ανά κόμμα σε εθνικό επίπεδο</strong>, αλλά ο νόμος μετράει έδρες <em>ανά επαρχία</em>. Ο προσομοιωτής γεφυρώνει αυτό το κενό με μία ρητή προσέγγιση — τη μόνη του πιπέλαϊν που <strong>δεν</strong> είναι ακριβής. Η ίδια η κατανομή εδρών παραμένει ακριβώς όπως στον νόμο.
      {:else}
        Polls give us <strong>one national percentage per party</strong>, but the law counts seats <em>per district</em>. The simulator bridges that gap with an explicit approximation — the only step in the pipeline that is <strong>not</strong> exact. The seat allocation itself is exactly what the law prescribes.
      {/if}
    </p>

    <Callout
      tone="info"
      title={lang === 'el' ? 'Ο τύπος' : 'The formula'}
      label={lang === 'el' ? 'Προσέγγιση' : 'Approximation'}
    >
      <p>
        {#if lang === 'el'}
          Για κάθε κόμμα και κάθε επαρχία, οι προσομοιωμένες ψήφοι είναι:
        {:else}
          For each party in each district, simulated votes are:
        {/if}
      </p>
      <dl class="formula-list">
        <dt>{lang === 'el' ? 'ψήφοι' : 'votes'}</dt>
        <dd>
          <KMath
            expr={'=\\; \\text{national share} \\,\\times\\, \\text{registered voters} \\,\\times\\, \\text{turnout} \\,\\times\\, \\text{intensity}'}
          />
        </dd>
      </dl>
      <p class="math-legend-line">
        {#if lang === 'el'}
          Τα τρία πρώτα είναι γνωστά: το <em>εθνικό μερίδιο</em> το δίνει η δημοσκόπηση, οι <em>εγγεγραμμένοι</em> είναι δημόσιο στοιχείο, και η <em>προσέλευση</em> τίθεται από εσάς. Η <em>ένταση</em> είναι ο μόνος εκτιμώμενος όρος.
        {:else}
          Three of these are known: the <em>national share</em> comes from the poll, <em>registered voters</em> is public data, and <em>turnout</em> is the value you set. <em>Intensity</em> is the only estimated term.
        {/if}
      </p>
    </Callout>

    <p>
      {#if lang === 'el'}
        Ο <strong>συντελεστής έντασης</strong> δείχνει αν ένα κόμμα είναι ισχυρότερο ή ασθενέστερο σε μια συγκεκριμένη επαρχία σε σχέση με το μέγεθος του εκλογικού της σώματος. Υπολογίζεται από τα <strong>πραγματικά αποτελέσματα του 2021</strong>:
      {:else}
        The <strong>intensity coefficient</strong> captures whether a party over- or under-performs in a given district relative to the size of its electorate. It is computed from the <strong>actual 2021 results</strong>:
      {/if}
    </p>

    <dl class="formula-list">
      <dt>{lang === 'el' ? 'ένταση' : 'intensity'}</dt>
      <dd>
        <KMath
          expr={'=\\; \\dfrac{\\;\\text{party\\textquoteright s share of its 2021 vote from this district}\\;}{\\;\\text{district\\textquoteright s share of the national electorate}\\;}'}
        />
      </dd>
    </dl>

    <p>
      {#if lang === 'el'}
        Με άλλα λόγια: τιμή <strong>1</strong> σημαίνει ότι το κόμμα ψηφίστηκε εκεί ακριβώς στο μέτρο που θα περίμενε κανείς από τον πληθυσμό· <strong>πάνω από 1</strong> σημαίνει υπεραπόδοση, <strong>κάτω από 1</strong> υποαπόδοση. Νέα κόμματα χωρίς αναφορά στο 2021 παίρνουν προεπιλεγμένη ένταση <strong>1</strong> (ομοιόμορφη κατανομή).
      {:else}
        In plain terms: a value of <strong>1</strong> means the party polled exactly in proportion to the district's population; <strong>above 1</strong> means over-performance, <strong>below 1</strong> under-performance. New parties with no 2021 baseline default to an intensity of <strong>1</strong> (uniform).
      {/if}
    </p>

    <p>
      {#if lang === 'el'}
        Για τις λίγες περιπτώσεις του 2021 όπου είναι γνωστές μόνο οι έδρες ενός κόμματος σε μια επαρχία (όχι οι ψήφοι), η ένταση εκτιμάται από έναν συνδυασμό μεριδίου εδρών και πληθυσμού:
      {:else}
        For the handful of 2021 cases where only a party's seats in a district are known (not its votes), intensity is estimated from a blend of seat share and population:
      {/if}
    </p>

    <dl class="formula-list">
      <dt>{lang === 'el' ? 'βάρος' : 'weight'}</dt>
      <dd>
        <KMath
          expr={'=\\; \\text{registered voters} \\,\\times\\, \\left(0.1 \\,+\\, 1.8 \\,\\times\\, \\dfrac{\\text{party\\textquoteright s seats}}{\\text{district\\textquoteright s seats}}\\right)'}
        />
      </dd>
    </dl>

    <p>
      {#if lang === 'el'}
        και οι αδιάθετες πανεθνικές ψήφοι του κόμματος κατανέμονται στις άγνωστες επαρχίες κατ' αναλογία αυτών των βαρών. Όλη η διαδικασία είναι ντοκουμενταρισμένη ως προσέγγιση στο UI του προσομοιωτή· από εκεί και πέρα, οι προσομοιωμένες ψήφοι τροφοδοτούν τον ακριβή αλγόριθμο κατανομής εδρών.
      {:else}
        and the party's residual national votes are spread across the unknown districts in proportion to these weights. The whole step is flagged as an approximation in the simulator UI; from there onward, the simulated votes feed the exact seat-allocation algorithm.
      {/if}
    </p>

    <Callout
      tone="fact"
      title={lang === 'el' ? 'Παράκαμψη: το προκαθορισμένο σενάριο του 2021' : 'Escape hatch: the 2021 preset'}
    >
      <p>
        {#if lang === 'el'}
          Όταν επιλέγετε «πραγματικά αποτελέσματα 2021», η παραπάνω προσέγγιση <strong>παρακάμπτεται εντελώς</strong>: ο προσομοιωτής τροφοδοτεί απευθείας τις χειροκαλιβρωμένες ψήφους ανά επαρχία και αναπαράγει ακριβώς το ιστορικό 17/15/9/4/4/4/3 = 56 έδρες. Οποιαδήποτε χειροκίνητη αλλαγή μεριδίου ακυρώνει την παράκαμψη.
        {:else}
          When you pick the "2021 actual" preset, the approximation above is <strong>bypassed entirely</strong>: the simulator feeds the algorithm hand-calibrated district vote counts directly, reproducing the historic 17/15/9/4/4/4/3 = 56 seats exactly. Editing any share clears the override.
        {/if}
      </p>
    </Callout>
  </SectionBlock>
</PageShell>

<style>
  .math-legend-line {
    margin-top: var(--sp-2);
    font-size: var(--fs-90);
    color: var(--color-ink-2, inherit);
  }

  .formula-list {
    display: grid;
    grid-template-columns: max-content 1fr;
    column-gap: var(--sp-3);
    row-gap: var(--sp-2);
    align-items: baseline;
    margin: var(--sp-3) 0;
    padding: 0;
  }
  .formula-list dt {
    margin: 0;
    font-family: var(--font-sans);
    font-weight: 600;
    color: var(--color-ink);
    white-space: nowrap;
  }
  .formula-list dd {
    margin: 0;
    min-width: 0;
    overflow-x: auto;
  }

  .inline-link {
    color: var(--color-accent);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    font-weight: 600;
  }
  .inline-link:hover { text-decoration-thickness: 2px; }
</style>
