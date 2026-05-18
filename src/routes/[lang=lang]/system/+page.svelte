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
      {lang === 'el'
        ? 'Το Σύνταγμα του 1960 όρισε τη Βουλή των Αντιπροσώπων σε 50 έδρες, 35 για Ελληνοκύπριους και 15 για Τουρκοκύπριους. Μετά την αποχώρηση των Τουρκοκυπρίων από τους θεσμούς της Δημοκρατίας το 1963–64, η Βουλή λειτουργεί αποκλειστικά με τους Ελληνοκυπρίους εκπροσώπους.'
        : 'The 1960 Constitution set the House of Representatives at 50 seats — 35 Greek-Cypriot and 15 Turkish-Cypriot. After Turkish Cypriots withdrew from the institutions of the Republic in 1963–64, the House has operated with the Greek-Cypriot benches alone.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Το 1985, υπό το λεγόμενο «δόγμα της ανάγκης», με κοινό νόμο διευρύνθηκε η Βουλή στις 80 έδρες (56 Ελληνοκύπριοι + 24 Τουρκοκύπριοι). Οι 24 τουρκοκυπριακές έδρες παραμένουν κενές. Έτσι, στις εκλογές της 24ης Μαΐου 2026, οι ψηφοφόροι θα κρίνουν στην πράξη 56 έδρες.'
        : 'In 1985, under the so-called "doctrine of necessity", ordinary law enlarged the House to 80 seats (56 Greek-Cypriot + 24 Turkish-Cypriot). The 24 Turkish-Cypriot seats have stayed vacant ever since. So on 24 May 2026 voters will fill 56 seats in practice.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Πέρα από τους βουλευτές, το σύστημα προβλέπει επίσης τρεις θρησκευτικούς εκπροσώπους — Αρμενίων, Μαρωνιτών και Λατίνων — οι οποίοι μετέχουν στη Βουλή χωρίς δικαίωμα ψήφου. Από την απόφαση Aziz κατά Κύπρου (ΕΔΔΑ, 2004), οι Τουρκοκύπριοι μόνιμοι κάτοικοι των ελεύθερων περιοχών μπορούν να εγγραφούν στους ελληνοκυπριακούς εκλογικούς καταλόγους· το 2026 είναι 859 από συνολικά 568.587 εγγεγραμμένους ψηφοφόρους.'
        : 'Beyond the deputies, three religious-group representatives — Armenian, Maronite and Latin — sit in the House without voting rights. Since the European Court of Human Rights judgment in Aziz v. Cyprus (2004), Turkish Cypriots resident in the government-controlled areas may register on the Greek-Cypriot roll; in 2026, 859 are registered out of 568,587 total voters.'}
    </p>
  </SectionBlock>

  <SectionBlock
    id="first-distribution"
    eyebrow={lang === 'el' ? 'Φάση 1' : 'Stage 1'}
    title={lang === 'el' ? 'Πρώτη κατανομή — επαρχιακό μέτρο Hare' : 'First distribution — district Hare quota'}
  >
    <p>
      {lang === 'el'
        ? 'Σε κάθε μία από τις έξι επαρχίες, η κατανομή ξεκινά με ένα απλό υπολογισμό: το εκλογικό μέτρο. Διαιρούμε τους έγκυρους ψήφους της επαρχίας με τις έδρες που της αναλογούν, και κρατάμε μόνο τον ακέραιο. Κάθε κόμμα κερδίζει τόσες έδρες όσες φορές χωράει το μέτρο στις ψήφους του — πάλι παίρνοντας τον ακέραιο.'
        : 'In each of the six districts, allocation begins with one calculation: the electoral quota. Divide the district\'s valid votes by the seats it is awarded, keeping only the integer. Each party wins as many seats as the quota fits into its vote total — again, integer only.'}
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
      {lang === 'el'
        ? 'Παράδειγμα από την Κερύνεια το 2021: 17.556 έγκυροι ψήφοι ÷ 3 έδρες = μέτρο 5.852. Κανένα κόμμα δεν έφτασε αυτό το μέτρο, καθώς το μεγαλύτερο (ΑΚΕΛ) έλαβε μόνο 4.296 ψήφους. Αποτέλεσμα: μηδέν έδρες κατανέμονται στην πρώτη φάση και οι τρεις έδρες της Κερύνειας διεκδικούνται όλες στην εθνική δεξαμενή.'
        : 'Take Kyrenia in 2021: 17,556 valid votes ÷ 3 seats = a quota of 5,852. No party reached it (the largest, AKEL, polled 4,296). So zero seats were awarded in stage 1, and all three Kyrenia seats were contested in the national pool.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Οι «αχρησιμοποίητες ψήφοι» — οι ψήφοι κάθε κόμματος που δεν αρκούσαν για ακόμη μία έδρα — είναι το νόμισμα που μεταφέρεται στις επόμενες φάσεις. Γενικά, σχεδόν κάθε εκλογή αφήνει 12–18 έδρες ανοικτές μετά την πρώτη κατανομή.'
        : 'The "unused votes" — each party\'s remainder, the votes that did not stretch to another seat — become the currency carried into the next stages. In practice, almost every election leaves 12–18 seats unfilled after the first distribution.'}
    </p>
  </SectionBlock>

  <SectionBlock
    id="second-distribution"
    eyebrow={lang === 'el' ? 'Φάση 2' : 'Stage 2'}
    title={lang === 'el' ? 'Δεύτερη κατανομή — εθνική δεξαμενή με όριο 3,6%' : 'Second distribution — national pool with 3.6% threshold'}
  >
    <p>
      {lang === 'el'
        ? 'Όλη η Κύπρος αντιμετωπίζεται ως μία ενιαία περιφέρεια. Αθροίζονται οι αχρησιμοποίητες ψήφοι των κομμάτων που πέρασαν το όριο και υπολογίζεται ένα νέο εθνικό μέτρο: σύνολο αχρησιμοποίητων ψήφων ÷ έδρες που παραμένουν κενές. Κάθε δικαιούμενο κόμμα παίρνει τόσες επιπλέον έδρες όσες χωράει το εθνικό μέτρο στις αχρησιμοποίητες ψήφους του.'
        : 'All of Cyprus is treated as a single constituency. The unused votes of qualifying lists are summed and divided by the seats that remain unfilled, producing a second-stage quota. Each qualifying list wins as many extra seats as that quota fits into its national unused-vote total.'}
    </p>
    <Callout tone="info" title={lang === 'el' ? 'Τα όρια εισόδου' : 'The participation thresholds'}>
      <p>
        {lang === 'el'
          ? 'Μονό κόμμα: 3,6%. Συνασπισμός δύο κομμάτων: 10%. Συνασπισμός τριών ή περισσοτέρων: 20%. Όλα τα ποσοστά επί του πανεθνικού έγκυρου ψήφου.'
          : 'Single party: 3.6%. Two-party coalition: 10%. Coalition of three or more parties: 20%. All percentages are of the nationwide valid vote.'}
      </p>
      <p>
        {lang === 'el'
          ? 'Το όριο της Φάσης 3 (υπολειπόμενες έδρες) είναι 7,2%.'
          : 'The threshold for stage 3 (residual seats) is 7.2%.'}
      </p>
    </Callout>
    <p>
      {lang === 'el'
        ? 'Το ενιαίο όριο του 3,6% ψηφίστηκε με τη μεταρρύθμιση του 2015 και διπλασίασε το προηγούμενο όριο του 1,8% (≈ 1/56 των εγκύρων). Στόχος ήταν να περιοριστεί ο κατακερματισμός, αλλά όπως σημειώνει η επιστημονική βιβλιογραφία η αλλαγή «δεν απέτρεψε ένα έντονα κατακερματισμένο κοινοβούλιο».'
        : 'The unified 3.6% bar was introduced by the 2015 reform, doubling the previous 1.8% threshold (≈ 1/56 of valid votes). The intent was to limit fragmentation; the academic literature notes the change "did not avert a highly fragmented parliament".'}
    </p>
    <p>
      {lang === 'el'
        ? 'Συνέπεια: μία λίστα που έλαβε 3,27% πανεθνικά — όπως οι Κυνηγοί το 2021 με 11.712 ψήφους — αποκλείστηκε πλήρως. Όλες της οι ψήφοι μηδενίστηκαν στις επόμενες κατανομές, παρότι ξεπέρασε άλλα έξι κόμματα στην κάλπη. Συνολικά, περίπου 15.000 ψήφοι για υπο-όριο λίστες απορρίφθηκαν εκείνο το βράδυ.'
        : 'The consequence: a list polling 3.27% nationally — like the Hunters in 2021, with 11,712 votes — was excluded entirely. All of its votes were wiped from the later stages, even though it outpolled six other lists at the ballot box. In total, roughly 15,000 sub-threshold votes were discarded on the night.'}
    </p>
  </SectionBlock>

  <SectionBlock
    id="third-distribution"
    eyebrow={lang === 'el' ? 'Φάση 3' : 'Stage 3'}
    title={lang === 'el' ? 'Τρίτη κατανομή — υπόλοιπες έδρες με όριο 7,2%' : 'Third distribution — residual seats with 7.2% threshold'}
  >
    <p>
      {lang === 'el'
        ? 'Αν μετά τη δεύτερη κατανομή παραμείνουν κενές έδρες — πράγμα συνηθισμένο επειδή το εθνικό μέτρο δίνει ακέραιες έδρες και αφήνει πάλι υπόλοιπα — οι έδρες αυτές δίνονται με σειρά κατάταξης στα κόμματα με τις περισσότερες εναπομείνασες αχρησιμοποίητες ψήφους. Στη φάση αυτή δικαιούνται συμμετοχή μόνο τα κόμματα που έχουν πανεθνικό ποσοστό τουλάχιστον 7,2%.'
        : 'If seats are still unfilled after stage 2 — typical, because the national quota also produces remainders — they are awarded by ranking the parties with the largest leftover unused votes. Only lists that cleared 7.2% nationally are eligible at this stage.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Έτσι ένα κόμμα μπορεί να συμμετέχει στη Φάση 2 (όριο 3,6%) αλλά να αποκλειστεί από τη Φάση 3 (όριο 7,2%): παίρνει ό,τι μπορεί στη δεύτερη φάση και αποσύρεται από την τρίτη.'
        : 'A party can thus take part in stage 2 (3.6% bar) but be excluded from stage 3 (7.2% bar): it picks up what it can in the second round and steps out for the third.'}
    </p>
  </SectionBlock>

  <SectionBlock
    id="back-to-districts"
    eyebrow={lang === 'el' ? 'Επανακατανομή' : 'Allocation back to districts'}
    title={lang === 'el' ? 'Πώς γυρίζουν οι εθνικές έδρες στις επαρχίες' : 'How national seats come back to districts'}
  >
    <p>
      {lang === 'el'
        ? 'Οι έδρες που κερδήθηκαν στη δεύτερη και τρίτη κατανομή πρέπει να αντιστοιχιστούν σε συγκεκριμένες επαρχίες. Ο νόμος ορίζει μία σαφή σειρά: τα κόμματα κατατάσσονται κατά συνολικές ψήφους και κάθε κόμμα παίρνει έδρα στην επαρχία όπου είχε τις περισσότερες αχρησιμοποίητες ψήφους στην πρώτη κατανομή — εφόσον αυτή η επαρχία δεν έχει ήδη συμπληρωθεί. Η διαδικασία επαναλαμβάνεται μέχρι να τοποθετηθεί κάθε εθνική έδρα σε μία επαρχία.'
        : 'Seats won at the national level must be assigned to specific districts. The law sets a clear order: parties are ranked by total votes, and each is awarded a seat in the district where it had the largest unused-vote pile in the first distribution — provided that district has not already been filled. The process repeats until every national seat is placed in a district.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Αποτέλεσμα: ένα κόμμα μπορεί να μην έφτασε το επαρχιακό μέτρο σε καμία επαρχία, και όμως να καταλήξει με έδρες σε αρκετές επαρχίες, αν το πανεθνικό του ποσοστό πέρασε το 3,6%. Όπως το διατύπωσε ο Cyprus Mail (10 Μαΐου 2026): «Το παρόν εκλογικό σύστημα προβλέπει την κατανομή εδρών στην πρώτη κατανομή σε απλή αναλογική βάση, ενώ στις επόμενες δύο φάσεις της δεύτερης κατανομής εφαρμόζεται ενισχυμένη αναλογική με όρια 3,6% και 7,2% αντίστοιχα.»'
        : 'The upshot: a party may not have reached the quota in any district and still end up with seats in several, provided its national share crossed 3.6%. As the Cyprus Mail put it (10 May 2026): "The current electoral system provides for the allocation of parliamentary seats at the first distribution on a simple pro rata basis, while in the two subsequent phases of the second allocation, a reinforced proportional representation system is applied, with thresholds of 3.6 per cent and 7.2 per cent, respectively."'}
    </p>
  </SectionBlock>

  <SectionBlock
    id="ballot"
    eyebrow={lang === 'el' ? 'Στην κάλπη' : 'At the ballot box'}
    title={lang === 'el' ? 'Η ψηφοφορία στην πράξη' : 'How voting actually works'}
  >
    <p>
      {lang === 'el'
        ? 'Κάθε επαρχία έχει το δικό της χρώμα ψηφοδελτίου — λευκό για τη Λευκωσία, κίτρινο για τη Λεμεσό, μπλε για την Αμμόχωστο, ροζ για τη Λάρνακα, πράσινο για την Πάφο, πορτοκαλί για την Κερύνεια. Στη Λευκωσία, με 19 λίστες και 19 έδρες, το ψηφοδέλτιο εκτείνεται σε δύο διπλωμένα φύλλα. Μόνο η Λάρνακα έχει μονόπλευρο ψηφοδέλτιο.'
        : 'Every district has its own ballot colour — white for Nicosia, yellow for Limassol, blue for Famagusta, pink for Larnaca, green for Paphos, orange for Kyrenia. In Nicosia, with 19 lists and 19 seats, the ballot extends over two folded sheets. Only Larnaca uses a single-sided ballot.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Στο κάτω μέρος κάθε στήλης υπάρχει το κουτάκι του κόμματος, που σημειώνεται με «Χ», «+» ή «✔». Κάθε άλλο σημάδι ακυρώνει το ψηφοδέλτιο. Δίπλα σε κάθε υποψήφιο υπάρχει μικρότερο κουτάκι: ο ψηφοφόρος δικαιούται μέχρι έναν σταυρό προτίμησης για κάθε τέσσερις έδρες της επαρχίας του, στρογγυλοποιημένα προς τα πάνω. Οι σταυροί είναι προαιρετικοί· μία απλή ψήφος κόμματος μετράει κανονικά.'
        : 'At the bottom of every column is the party box, marked with "X", "+" or "✔". Any other mark invalidates the ballot. Beside each candidate is a smaller box: a voter may mark up to one preference cross for every four seats in the district, rounded up. Crosses are optional; a plain party vote counts.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Οι σταυροί επιτρέπονται μόνο εντός της λίστας που ψηφίστηκε: αν ο ψηφοφόρος βάλει σταυρούς σε δύο διαφορετικά κόμματα, το ψηφοδέλτιο ακυρώνεται. Οι αρχηγοί κομμάτων και οι επικεφαλής συνασπισμών αυτόματα κερδίζουν σταυρούς ίσους με τη συνολική ψήφο της λίστας — δεν χρειάζεται ο ψηφοφόρος να τους σημειώσει χωριστά. Το 2026 εξαιρούνται με αυτό τον τρόπο, μεταξύ άλλων, η Αννίτα Δημητρίου (ΔΗΣΥ), ο Στέφανος Στεφάνου (ΑΚΕΛ), ο Νικόλας Παπαδόπουλος (ΔΗΚΟ), ο Χρήστος Χρήστου (ΕΛΑΜ) και ο Οδυσσέας Μιχαηλίδης (ΑΛΜΑ).'
        : 'Crosses are only valid within the list you voted: if a voter marks crosses on two different lists, the ballot is invalid. Party leaders and coalition heads automatically receive crosses equal to the list\'s total vote — voters do not need to mark them. For 2026 those exempted include Annita Demetriou (DISY), Stefanos Stefanou (AKEL), Nicolas Papadopoulos (DIKO), Christos Christou (ELAM) and Odysseas Michaelides (ALMA).'}
    </p>
    <p>
      {lang === 'el'
        ? 'Στην κάθε λίστα οι έδρες που κερδήθηκαν στην επαρχία πάνε στους υποψηφίους με τους περισσότερους προσωπικούς σταυρούς — οπότε οι σταυροί έχουν σημασία όχι για το ποιο κόμμα μπαίνει αλλά για το ποιοι υποψήφιοι του κόμματος εκλέγονται.'
        : 'Within each list the seats won in the district go to the candidates with the most personal crosses — so preference crosses do not decide which list enters parliament; they decide which candidates of that list are elected.'}
    </p>

    <BallotPreview districtId="NIC" {lang} />
  </SectionBlock>
</PageShell>
