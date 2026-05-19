<script lang="ts">
  import { PageShell, SectionBlock, Callout } from '$components/layout';
  import { BallotPreview } from '$components/map';

  let { data } = $props();
  const lang = $derived(data.lang);
  const currentPath = $derived(data.currentPath);
</script>

<PageShell
  {lang}
  {currentPath}
  numeral="3"
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
      <p>
        <strong>{lang === 'el' ? 'Μέτρο' : 'Quota'}</strong> = floor(<em>{lang === 'el' ? 'έγκυροι ψήφοι' : 'valid votes'}</em> ÷ <em>{lang === 'el' ? 'έδρες' : 'seats'}</em>)
      </p>
      <p>
        <strong>{lang === 'el' ? 'Έδρες κόμματος' : 'Party seats'}</strong> = floor(<em>{lang === 'el' ? 'ψήφοι κόμματος' : 'party votes'}</em> ÷ <em>{lang === 'el' ? 'μέτρο' : 'quota'}</em>)
      </p>
      <p>
        <strong>{lang === 'el' ? 'Αχρησιμοποίητες ψήφοι' : 'Unused votes'}</strong> = <em>{lang === 'el' ? 'ψήφοι κόμματος' : 'party votes'}</em> − (<em>{lang === 'el' ? 'έδρες' : 'seats'}</em> × <em>{lang === 'el' ? 'μέτρο' : 'quota'}</em>)
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
        Οι έδρες που κερδήθηκαν στη δεύτερη και τρίτη κατανομή πρέπει να αντιστοιχιστούν σε συγκεκριμένες επαρχίες. Ο νόμος ορίζει μία σαφή σειρά: τα κόμματα κατατάσσονται <strong>κατά συνολικές ψήφους</strong> και κάθε κόμμα παίρνει έδρα στην επαρχία όπου είχε τις <strong>περισσότερες αχρησιμοποίητες ψήφους</strong> στην πρώτη κατανομή, εφόσον αυτή η επαρχία δεν έχει ήδη συμπληρωθεί. Η διαδικασία επαναλαμβάνεται μέχρι να τοποθετηθεί κάθε εθνική έδρα σε μία επαρχία.
      {:else}
        Seats won at the national level must be assigned to specific districts. The law sets a clear order: parties are <strong>ranked by total votes</strong>, and each is awarded a seat in the district where it had the <strong>largest unused-vote pile</strong> in the first distribution, provided that district has not already been filled. The process repeats until every national seat is placed in a district.
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        Αποτέλεσμα: ένα κόμμα μπορεί να μην έφτασε το επαρχιακό μέτρο σε <strong>καμία</strong> επαρχία, και όμως να καταλήξει με έδρες σε αρκετές επαρχίες, αν το πανεθνικό του ποσοστό πέρασε το <strong>3,6%</strong>. Όπως το διατύπωσε ο Cyprus Mail (10 Μαΐου 2026): «Το παρόν εκλογικό σύστημα προβλέπει την κατανομή εδρών στην πρώτη κατανομή σε απλή αναλογική βάση, ενώ στις επόμενες δύο φάσεις της δεύτερης κατανομής εφαρμόζεται ενισχυμένη αναλογική με όρια 3,6% και 7,2% αντίστοιχα.»
      {:else}
        The upshot: a party may not have reached the quota in <strong>any</strong> district and still end up with seats in several, provided its national share crossed <strong>3.6%</strong>. As the Cyprus Mail put it (10 May 2026): "The current electoral system provides for the allocation of parliamentary seats at the first distribution on a simple pro rata basis, while in the two subsequent phases of the second allocation, a reinforced proportional representation system is applied, with thresholds of 3.6 per cent and 7.2 per cent, respectively."
      {/if}
    </p>
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
</PageShell>
