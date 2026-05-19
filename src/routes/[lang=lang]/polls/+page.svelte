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
      {#if lang === 'el'}
        Στις δημοσκοπήσεις που δημοσιεύτηκαν μεταξύ <strong>5 και 17 Μαΐου 2026</strong>, ο <strong>ΔΗΣΥ</strong> επανέκτησε <strong>μικρό προβάδισμα</strong> από το ΑΚΕΛ στις περισσότερες εταιρείες (Explorer <strong>19,7 vs 18,8</strong>· Prime/SIGMA <strong>18,0 vs 17,6</strong>· RAI/Alpha <strong>18,2 vs 15,2</strong>). Δύο εταιρείες, η <strong>MRC Cypronetwork</strong> και η <strong>CYMAR</strong>, εμφανίζουν τα δύο κόμματα <strong>ισόπαλα</strong>. Το <strong>ΕΛΑΜ</strong> διατηρεί την τρίτη θέση γύρω στο <strong>10–14%</strong>, με την <strong>υψηλότερη συσπείρωση</strong> από κάθε άλλο κόμμα (<strong>79%</strong> κατά Cypronetwork).
      {:else}
        In polls published between <strong>5 and 17 May 2026</strong>, <strong>DISY</strong> reclaimed a <strong>narrow lead</strong> over AKEL with most pollsters (Explorer <strong>19.7 vs 18.8</strong>; Prime/SIGMA <strong>18.0 vs 17.6</strong>; RAI/Alpha <strong>18.2 vs 15.2</strong>). Two of them, <strong>MRC Cypronetwork</strong> and <strong>CYMAR</strong>, show the two parties <strong>level</strong>. <strong>ELAM</strong> holds third place at around <strong>10–14%</strong>, with the <strong>highest voter-consolidation rate</strong> of any party (<strong>79%</strong> per Cypronetwork).
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        Δύο μετατοπίσεις ξεχωρίζουν στην τελική εβδομάδα: το <strong>ΑΛΜΑ</strong> υποχωρεί <strong>2+ μονάδες</strong> από τα ύψη του Απριλίου («σημαντική πτώση», σύμφωνα με τον Φιλελεύθερο), ενώ τα <strong>Volt</strong> και <strong>ΕΔΕΚ</strong> ανεβαίνουν ελαφρά. Η ακραία τιμή της RealPolls δείχνει το Volt πάνω από το όριο (<strong>7,2%</strong>). Ο γενικός κανόνας: ο <strong>κατακερματισμός παγιώνεται</strong>. Επτά κόμματα φαίνονται να μπαίνουν στη νέα Βουλή και <strong>κανένα δεν πλησιάζει την πλειοψηφία των 29 εδρών</strong>.
      {:else}
        Two shifts stood out in the final week: <strong>ALMA</strong> slipped <strong>2+ points</strong> from its April highs (a "significant drop", per Phileleftheros), while <strong>Volt</strong> and <strong>EDEK</strong> edged upward. The RealPolls outlier even put Volt above the <strong>7.2% bar</strong>. The pattern: <strong>fragmentation has locked in</strong>. Seven parties look set to enter the new House, and <strong>none comes close to the 29-seat majority threshold</strong>.
      {/if}
    </p>
    <Callout tone="warn">
      {#if lang === 'el'}
        <strong>Καμία νέα δημοσκόπηση</strong> δεν επιτρέπεται να δημοσιευτεί από τις <strong>22:00 της Παρασκευής 22 Μαΐου</strong> έως τις <strong>18:00 της Κυριακής 24 Μαΐου</strong>. Όλα τα αριθμητικά αυτής της σελίδας προέρχονται από δημοσκοπήσεις πριν από αυτό το χρονικό όριο.
      {:else}
        <strong>No new poll figures</strong> may be published from <strong>22:00 Friday 22 May</strong> to <strong>18:00 Sunday 24 May</strong>. All figures on this page come from polls published before that blackout window.
      {/if}
    </Callout>
  </SectionBlock>

  <SectionBlock
    id="caveats"
    eyebrow={lang === 'el' ? 'Επιφυλάξεις' : 'Caveats'}
    title={lang === 'el' ? 'Γιατί οι δημοσκοπήσεις μπορούν να παραπλανήσουν' : 'Why polls can mislead'}
  >
    <p>
      {#if lang === 'el'}
        <strong>Πρώτον, η αναγωγή στα έγκυρα.</strong> Οι περισσότερες κυπριακές εταιρείες δημοσιεύουν δύο εκδοχές της ίδιας δημοσκόπησης: τα ποσοστά <em>«επί συνόλου»</em> και τα ποσοστά <em>«μετά από αναγωγή στα έγκυρα»</em>, όπου αφαιρούνται οι αναποφάσιστοι και οι αρνούμενοι να ψηφίσουν. Η δεύτερη εκδοχή <strong>φουσκώνει συστηματικά</strong> τα ποσοστά των μεγάλων κομμάτων. Η τελευταία RAI/Alpha έδειξε ΔΗΣΥ <strong>18,2% επί συνόλου</strong>, αλλά <strong>24,5% επί εγκύρων</strong>.
      {:else}
        <strong>First, the "redistribution-to-valid" convention.</strong> Most Cypriot pollsters publish two versions of the same poll: the <em>raw shares</em> and the shares after <em>redistribution to valid votes</em> (i.e. with undecided and refused voters removed). The redistributed numbers <strong>systematically inflate</strong> the major parties. The final RAI/Alpha showed DISY at <strong>18.2% raw</strong>, but <strong>24.5% after redistribution</strong>.
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        <strong>Δεύτερον, η δεξαμενή αναποφάσιστων.</strong> Στην τελική RAI/Alpha έφτασε το <strong>26,3%</strong>, σχεδόν όσο ΔΗΣΥ και ΑΚΕΛ μαζί. Η CYMAR κατέγραψε <strong>17%</strong>, η Stratego/Kathimerini <strong>8,1%</strong>. Όσο μεγαλύτερη η δεξαμενή αυτή, τόσο μεγαλύτερο το <strong>περιθώριο έκπληξης</strong> το βράδυ των εκλογών.
      {:else}
        <strong>Second, the undecided pool.</strong> In the final RAI/Alpha it reached <strong>26.3%</strong>, almost as much as DISY and AKEL combined. CYMAR recorded <strong>17%</strong>, Stratego/Kathimerini <strong>8.1%</strong>. The larger that pool, the bigger the <strong>room for election-night surprise</strong>.
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        <strong>Τρίτον, τα νέα κόμματα δεν έχουν ιστορικό.</strong> Ο αναλυτής Χριστόφορος Χριστοφόρου (Cyprus Mail, 17 Μαΐου 2026) σημειώνει εύρος <strong>±7 μονάδων</strong> για την Άμεση Δημοκρατία και <strong>±4</strong> για το ΑΛΜΑ, γιατί οι εταιρείες δεν έχουν προηγούμενη βάση σύγκρισης. Το 2024, ο <strong>Φειδίας Παναγιώτου</strong> δημοσκοπούνταν στο <strong>3,8%</strong> δύο εβδομάδες πριν τις ευρωεκλογές και κατέληξε να παίρνει <strong>19,4%</strong>, ένα <strong>σφάλμα 15,6 ποσοστιαίων μονάδων</strong>.
      {:else}
        <strong>Third, new parties have no historical baseline.</strong> Analyst Christoforos Christoforou (Cyprus Mail, 17 May 2026) notes a <strong>±7-point spread</strong> for Direct Democracy and <strong>±4</strong> for ALMA, because pollsters lack any prior reference. In 2024, <strong>Fidias Panayiotou</strong> was polling <strong>3.8%</strong> two weeks before the EP election and ended up with <strong>19.4%</strong>, a <strong>15.6-point miss</strong>.
      {/if}
    </p>
    <p>
      {#if lang === 'el'}
        Και το πιο σημαντικό: <strong>οι δημοσκοπήσεις μετρούν εθνικό ποσοστό. Όμως οι έδρες κερδίζονται επαρχία προς επαρχία.</strong> Ένα κόμμα με <strong>4%</strong> μπορεί να βγει εκτός Βουλής· ένα με <strong>4,2%</strong> μπορεί να καταλήξει με <strong>2–3 έδρες</strong> ανάλογα με την κατανομή. Δείτε τον προσομοιωτή.
      {:else}
        And the most important point: <strong>polls report national share, but seats are won district by district.</strong> A party on <strong>4%</strong> can end up locked out; one on <strong>4.2%</strong> can finish with <strong>2 or 3 seats</strong> depending on how its vote is spread. See the simulator.
      {/if}
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
