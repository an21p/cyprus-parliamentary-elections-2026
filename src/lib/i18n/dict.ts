export type Lang = 'en' | 'el';

export const LANGS: Lang[] = ['en', 'el'];
export const DEFAULT_LANG: Lang = 'en';

type Dict = Record<string, { en: string; el: string }>;

export const messages: Dict = {
  // Site identity
  'site.title': {
    en: 'Cyprus Parliamentary Elections 2026',
    el: 'Βουλευτικές Εκλογές Κύπρου 2026'
  },
  'site.tagline': {
    en: 'How parliament is really chosen, and why polls don’t tell the whole story',
    el: 'Πώς εκλέγεται πραγματικά η Βουλή και γιατί οι δημοσκοπήσεις δεν δείχνουν όλη την εικόνα'
  },

  // Navigation
  'nav.home': { en: 'Home', el: 'Αρχική' },
  'nav.system': { en: 'System', el: 'Σύστημα' },
  'nav.simulator': { en: 'Simulator', el: 'Προσομοιωτής' },
  'nav.polls': { en: 'Polls', el: 'Δημοσκοπήσεις' },
  'nav.districts': { en: 'Districts', el: 'Επαρχίες' },
  'nav.parties': { en: 'Parties', el: 'Κόμματα' },
  'nav.worked_example': { en: 'Example', el: 'Παράδειγμα' },
  'nav.about': { en: 'About', el: 'Σχετικά' },

  // Language switcher
  'lang.switch_to_en': { en: 'English', el: 'English' },
  'lang.switch_to_el': { en: 'Ελληνικά', el: 'Ελληνικά' },

  // Accessibility
  'a11y.colourblind.label': {
    en: 'Colourblind-friendly palette',
    el: 'Παλέτα φιλική για αχρωματοψία'
  },
  'a11y.colourblind.on': { en: 'On', el: 'Ενεργό' },
  'a11y.colourblind.off': { en: 'Off', el: 'Ανενεργό' },
  'a11y.colourblind.aria_toggle': {
    en: 'Toggle colourblind-friendly party colours',
    el: 'Εναλλαγή χρωμάτων κομμάτων για αχρωματοψία'
  },
  'a11y.colourblind.hint': {
    en: 'Swap brand colours for a palette designed to remain distinct under common forms of colour vision deficiency.',
    el: 'Αντικαθιστά τα χρώματα των κομμάτων με παλέτα σχεδιασμένη να ξεχωρίζει σε συνήθεις μορφές αχρωματοψίας.'
  },

  // Common labels
  'label.seats': { en: 'seats', el: 'έδρες' },
  'label.votes': { en: 'votes', el: 'ψήφοι' },
  'label.vote_share': { en: 'vote share', el: 'ποσοστό ψήφων' },
  'label.threshold': { en: 'threshold', el: 'όριο' },
  'label.district': { en: 'district', el: 'επαρχία' },
  'label.party': { en: 'party', el: 'κόμμα' },
  'label.leader': { en: 'leader', el: 'αρχηγός' },
  'label.unused_votes': { en: 'unused votes', el: 'αχρησιμοποίητες ψήφοι' },
  'label.quota': { en: 'electoral quota', el: 'εκλογικό μέτρο' },
  'label.coming_soon': { en: 'Coming soon', el: 'Σύντομα' },

  // Page-level
  'home.lede': {
    en: 'On Sunday 24 May 2026, voters will fill 56 seats in the House of Representatives. The result will look nothing like a national poll suggests.',
    el: 'Την Κυριακή 24 Μαΐου 2026 οι ψηφοφόροι θα κρίνουν 56 έδρες στη Βουλή των Αντιπροσώπων. Το αποτέλεσμα δεν θα μοιάζει με αυτό που δείχνει μία εθνική δημοσκόπηση.'
  },
  'home.cta_simulator': {
    en: 'Try the simulator',
    el: 'Δοκιμάστε τον προσομοιωτή'
  },
  'home.cta_system': {
    en: 'How the system works',
    el: 'Πώς λειτουργεί το σύστημα'
  },

  // Footer
  'footer.disclaimer': {
    en: 'Educational explainer. Not affiliated with any political party. Built from public research and government sources.',
    el: 'Ενημερωτική σελίδα. Δεν συνδέεται με κανένα κόμμα. Βασισμένη σε δημόσιες πηγές και κρατικά στοιχεία.'
  },
  'footer.sources': { en: 'Sources & methodology', el: 'Πηγές & μεθοδολογία' }
};

export function t(lang: Lang, key: keyof typeof messages): string {
  const entry = messages[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}

export function localizedName(
  entity: { name: { en: string; el: string } } | { en: string; el: string },
  lang: Lang
): string {
  if ('name' in entity) return entity.name[lang] ?? entity.name.en;
  return (entity as { en: string; el: string })[lang] ?? (entity as { en: string }).en;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'el' : 'en';
}
