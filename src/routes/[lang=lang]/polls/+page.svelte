<script lang="ts">
  import { PageShell, SectionBlock, Callout } from '$components/layout';
  import { PollTracker, PollTable } from '$components/charts';

  let { data } = $props();
  const lang = $derived(data.lang);
  const currentPath = $derived(data.currentPath);
</script>

<PageShell
  {lang}
  {currentPath}
  numeral="34"
  eyebrow={lang === 'el' ? 'Δημοσκοπήσεις' : 'Polls'}
  title={lang === 'el' ? 'Δημοσκοπήσεις 2026' : '2026 polling tracker'}
  lede={lang === 'el'
    ? 'Όλες οι δημοσιευμένες δημοσκοπήσεις από τα τέλη του 2024 έως τις 17 Μαΐου 2026, και γιατί χρειάζεται προσοχή στην ανάγνωσή τους.'
    : 'Every published poll from late 2024 to 17 May 2026, and why you should read them with care.'}
>
  <SectionBlock
    id="tracker"
    eyebrow={lang === 'el' ? 'Διαχρονικά' : 'Over time'}
    title={lang === 'el' ? 'Πορεία ποσοστών' : 'Vote-share trajectory'}
  >
    <p>
      {lang === 'el'
        ? 'Το γράφημα δείχνει κάθε δημοσκόπηση ως ένα σημείο για κάθε κόμμα, τοποθετημένο στη μέση της περιόδου της έρευνας. Επιλέξτε ή απενεργοποιήστε κόμματα από το υπόμνημα για να εστιάσετε σε συγκεκριμένες αναμετρήσεις.'
        : 'The chart plots each poll as a point per party, positioned at the midpoint of fieldwork. Toggle parties via the legend to focus on specific matchups.'}
    </p>
    <PollTracker {lang} />
  </SectionBlock>

  <SectionBlock
    id="latest"
    eyebrow={lang === 'el' ? 'Τελευταία εβδομάδα' : 'Final week'}
    title={lang === 'el' ? 'Τι έδειξαν οι τελευταίες δημοσκοπήσεις' : 'What the final polls showed'}
  >
    <p>
      {lang === 'el'
        ? 'Στις δημοσκοπήσεις που δημοσιεύτηκαν μεταξύ 5 και 17 Μαΐου 2026, ο ΔΗΣΥ επανέκτησε μικρό προβάδισμα από το ΑΚΕΛ στις περισσότερες εταιρείες (Explorer 19,7 vs 18,8· Prime/SIGMA 18,0 vs 17,6· RAI/Alpha 18,2 vs 15,2). Δύο εταιρείες, η MRC Cypronetwork και η CYMAR, εμφανίζουν τα δύο κόμματα ισόπαλα. Το ΕΛΑΜ διατηρεί την τρίτη θέση γύρω στο 10–14%, με την υψηλότερη συσπείρωση από κάθε άλλο κόμμα (79% κατά Cypronetwork).'
        : 'In polls published between 5 and 17 May 2026, DISY reclaimed a narrow lead over AKEL with most pollsters (Explorer 19.7 vs 18.8; Prime/SIGMA 18.0 vs 17.6; RAI/Alpha 18.2 vs 15.2). Two of them, MRC Cypronetwork and CYMAR, show the two parties level. ELAM holds third place at around 10–14%, with the highest voter-consolidation rate of any party (79% per Cypronetwork).'}
    </p>
    <p>
      {lang === 'el'
        ? 'Δύο μετατοπίσεις ξεχωρίζουν στην τελική εβδομάδα: το ΑΛΜΑ υποχωρεί 2+ μονάδες από τα ύψη του Απριλίου («σημαντική πτώση», σύμφωνα με τον Φιλελεύθερο), ενώ τα Volt και ΕΔΕΚ ανεβαίνουν ελαφρά. Η ακραία τιμή της RealPolls δείχνει το Volt πάνω από το όριο (7,2%). Ο γενικός κανόνας: ο κατακερματισμός παγιώνεται. Επτά κόμματα φαίνονται να μπαίνουν στη νέα Βουλή και κανένα δεν πλησιάζει την πλειοψηφία των 29 εδρών.'
        : 'Two shifts stood out in the final week: ALMA slipped 2+ points from its April highs (a "significant drop", per Phileleftheros), while Volt and EDEK edged upward. The RealPolls outlier even put Volt above the 7.2% bar. The pattern: fragmentation has locked in. Seven parties look set to enter the new House, and none comes close to the 29-seat majority threshold.'}
    </p>
    <Callout tone="warn">
      {lang === 'el'
        ? 'Καμία νέα δημοσκόπηση δεν επιτρέπεται να δημοσιευτεί από τις 22:00 της Παρασκευής 22 Μαΐου έως τις 18:00 της Κυριακής 24 Μαΐου. Όλα τα αριθμητικά αυτής της σελίδας προέρχονται από δημοσκοπήσεις πριν από αυτό το χρονικό όριο.'
        : 'No new poll figures may be published from 22:00 Friday 22 May to 18:00 Sunday 24 May. All figures on this page come from polls published before that blackout window.'}
    </Callout>
  </SectionBlock>

  <SectionBlock
    id="caveats"
    eyebrow={lang === 'el' ? 'Επιφυλάξεις' : 'Caveats'}
    title={lang === 'el' ? 'Γιατί οι δημοσκοπήσεις μπορούν να παραπλανήσουν' : 'Why polls can mislead'}
  >
    <p>
      {lang === 'el'
        ? 'Πρώτον, η αναγωγή στα έγκυρα. Οι περισσότερες κυπριακές εταιρείες δημοσιεύουν δύο εκδοχές της ίδιας δημοσκόπησης: τα ποσοστά «επί συνόλου» και τα ποσοστά «μετά από αναγωγή στα έγκυρα», όπου αφαιρούνται οι αναποφάσιστοι και οι αρνούμενοι να ψηφίσουν. Η δεύτερη εκδοχή φουσκώνει συστηματικά τα ποσοστά των μεγάλων κομμάτων. Η τελευταία RAI/Alpha έδειξε ΔΗΣΥ 18,2% επί συνόλου, αλλά 24,5% επί εγκύρων.'
        : 'First, the "redistribution-to-valid" convention. Most Cypriot pollsters publish two versions of the same poll: the raw shares and the shares after redistribution to valid votes (i.e. with undecided and refused voters removed). The redistributed numbers systematically inflate the major parties. The final RAI/Alpha showed DISY at 18.2% raw, but 24.5% after redistribution.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Δεύτερον, η δεξαμενή αναποφάσιστων. Στην τελική RAI/Alpha έφτασε το 26,3%, σχεδόν όσο ΔΗΣΥ και ΑΚΕΛ μαζί. Η CYMAR κατέγραψε 17%, η Stratego/Kathimerini 8,1%. Όσο μεγαλύτερη η δεξαμενή αυτή, τόσο μεγαλύτερο το περιθώριο έκπληξης το βράδυ των εκλογών.'
        : 'Second, the undecided pool. In the final RAI/Alpha it reached 26.3%, almost as much as DISY and AKEL combined. CYMAR recorded 17%, Stratego/Kathimerini 8.1%. The larger that pool, the bigger the room for election-night surprise.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Τρίτον, τα νέα κόμματα δεν έχουν ιστορικό. Ο αναλυτής Χριστόφορος Χριστοφόρου (Cyprus Mail, 17 Μαΐου 2026) σημειώνει εύρος ±7 μονάδων για την Άμεση Δημοκρατία και ±4 για το ΑΛΜΑ, γιατί οι εταιρείες δεν έχουν προηγούμενη βάση σύγκρισης. Το 2024, ο Φειδίας Παναγιώτου δημοσκοπούνταν στο 3,8% δύο εβδομάδες πριν τις ευρωεκλογές και κατέληξε να παίρνει 19,4%, ένα σφάλμα 15,6 ποσοστιαίων μονάδων.'
        : 'Third, new parties have no historical baseline. Analyst Christoforos Christoforou (Cyprus Mail, 17 May 2026) notes a ±7-point spread for Direct Democracy and ±4 for ALMA, because pollsters lack any prior reference. In 2024, Fidias Panayiotou was polling 3.8% two weeks before the EP election and ended up with 19.4%, a 15.6-point miss.'}
    </p>
    <p>
      {lang === 'el'
        ? 'Και το πιο σημαντικό: οι δημοσκοπήσεις μετρούν εθνικό ποσοστό. Όμως οι έδρες κερδίζονται επαρχία προς επαρχία. Ένα κόμμα με 4% μπορεί να βγει εκτός Βουλής· ένα με 4,2% μπορεί να καταλήξει με 2–3 έδρες ανάλογα με την κατανομή. Δείτε τον προσομοιωτή.'
        : 'And the most important point: polls report national share, but seats are won district by district. A party on 4% can end up locked out; one on 4.2% can finish with 2 or 3 seats depending on how its vote is spread. See the simulator.'}
    </p>
  </SectionBlock>

  <SectionBlock
    id="table"
    eyebrow={lang === 'el' ? 'Όλες οι δημοσκοπήσεις' : 'Full table'}
    title={lang === 'el' ? 'Πλήρης πίνακας δημοσκοπήσεων' : 'Complete polling table'}
  >
    <p>
      {lang === 'el'
        ? 'Όλες οι δημοσιευμένες δημοσκοπήσεις, με τη σειρά της πιο πρόσφατης πρώτα. Κάντε scroll οριζόντια αν χρειάζεται.'
        : 'All published polls, most recent first. Scroll horizontally if needed.'}
    </p>
    <PollTable {lang} />
  </SectionBlock>
</PageShell>
