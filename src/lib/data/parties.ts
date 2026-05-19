import type { Party, PartyId } from './types';

export const PARTIES: Party[] = [
  {
    id: 'DISY',
    name: {
      en: 'Democratic Rally',
      el: 'Δημοκρατικός Συναγερμός'
    },
    shortName: { en: 'DISY', el: 'ΔΗΣΥ' },
    leader: { en: 'Annita Demetriou', el: 'Αννίτα Δημητρίου' },
    colour: '#003a8c',
    alignment: {
      en: 'Centre-right (EPP)',
      el: 'Κεντροδεξιά (EPP)'
    },
    contested2021: true,
    seatsOutgoing: 17,
    newParty: false,
    logo: '/parties/disy.svg'
  },
  {
    id: 'AKEL',
    name: {
      en: 'Progressive Party of Working People',
      el: 'Ανορθωτικό Κόμμα Εργαζομένου Λαού'
    },
    shortName: { en: 'AKEL', el: 'ΑΚΕΛ' },
    leader: { en: 'Stefanos Stefanou', el: 'Στέφανος Στεφάνου' },
    colour: '#d62718',
    alignment: {
      en: 'Left (GUE/NGL)',
      el: 'Αριστερά (GUE/NGL)'
    },
    contested2021: true,
    seatsOutgoing: 15,
    newParty: false,
    notes: {
      en: 'Rebranded "AKEL – Social Alliance" since the 2024 EP election.',
      el: 'Μετονομάστηκε σε «ΑΚΕΛ – Κοινωνική Συμμαχία» μετά τις Ευρωεκλογές 2024.'
    },
    logo: '/parties/akel.svg'
  },
  {
    id: 'DIKO',
    name: {
      en: 'Democratic Party',
      el: 'Δημοκρατικό Κόμμα'
    },
    shortName: { en: 'DIKO', el: 'ΔΗΚΟ' },
    leader: { en: 'Nicolas Papadopoulos', el: 'Νικόλας Παπαδόπουλος' },
    colour: '#00bcd4',
    alignment: {
      en: 'Centrist / Greek-Cypriot nationalist',
      el: 'Κεντρώο / Ελληνοκυπριακός εθνικισμός'
    },
    contested2021: true,
    seatsOutgoing: 9,
    newParty: false,
    logo: '/parties/diko.svg'
  },
  {
    id: 'ELAM',
    name: {
      en: 'National Popular Front',
      el: 'Εθνικό Λαϊκό Μέτωπο'
    },
    shortName: { en: 'ELAM', el: 'ΕΛΑΜ' },
    leader: { en: 'Christos Christou', el: 'Χρήστος Χρήστου' },
    colour: '#000000',
    alignment: {
      en: 'Far-right, ultranationalist (ECR)',
      el: 'Άκρα δεξιά, υπερεθνικιστικό (ECR)'
    },
    contested2021: true,
    seatsOutgoing: 3,
    newParty: false,
    logo: '/parties/elam.png'
  },
  {
    id: 'EDEK',
    name: {
      en: 'Movement for Social Democracy',
      el: 'Κίνημα Σοσιαλδημοκρατών'
    },
    shortName: { en: 'EDEK', el: 'ΕΔΕΚ' },
    leader: { en: 'Nikos Anastasiou', el: 'Νίκος Αναστασίου' },
    colour: '#c2185b',
    alignment: {
      en: 'Social-democratic (S&D)',
      el: 'Σοσιαλδημοκρατικό (S&D)'
    },
    contested2021: true,
    seatsOutgoing: 2,
    newParty: false,
    logo: '/parties/edek.png'
  },
  {
    id: 'DIPA',
    name: {
      en: 'Democratic Alignment',
      el: 'Δημοκρατική Παράταξη'
    },
    shortName: { en: 'DIPA', el: 'ΔΗΠΑ' },
    leader: { en: 'Marios Garoyian', el: 'Μάριος Καρογιάν' },
    colour: '#00897b',
    alignment: {
      en: 'Centrist liberal',
      el: 'Κεντρώο φιλελεύθερο'
    },
    contested2021: true,
    seatsOutgoing: 4,
    newParty: false,
    logo: '/parties/dipa.png'
  },
  {
    id: 'KOSP',
    name: {
      en: "Movement of Ecologists – Citizens' Cooperation",
      el: 'Κίνημα Οικολόγων – Συνεργασία Πολιτών'
    },
    shortName: { en: 'KOSP (Greens)', el: 'ΚΟΣΠ (Οικολόγοι)' },
    leader: { en: 'Stavros Papadouris', el: 'Σταύρος Παπαδούρης' },
    colour: '#2e7d32',
    alignment: {
      en: 'Greens',
      el: 'Πράσινοι'
    },
    contested2021: true,
    seatsOutgoing: 2,
    newParty: false,
    notes: {
      en: 'Formed an electoral list with the Animal Party Cyprus (APC) for 2026.',
      el: 'Σχημάτισε εκλογικό συνδυασμό με το Κόμμα για τα Ζώα Κύπρου (APC) για το 2026.'
    },
    logo: '/parties/kosp.svg'
  },
  {
    id: 'ALMA',
    name: {
      en: 'ALMA – Citizens for Cyprus',
      el: 'ΑΛΜΑ – Πολίτες για την Κύπρο'
    },
    shortName: { en: 'ALMA', el: 'ΑΛΜΑ' },
    leader: { en: 'Odysseas Michaelides', el: 'Οδυσσέας Μιχαηλίδης' },
    colour: '#ffb300',
    alignment: {
      en: 'Reformist, anti-corruption',
      el: 'Μεταρρυθμιστικό, κατά της διαφθοράς'
    },
    contested2021: false,
    seatsOutgoing: 0,
    newParty: true,
    notes: {
      en: 'Founded May 2025 by former Auditor-General Odysseas Michaelides.',
      el: 'Ιδρύθηκε τον Μάιο 2025 από τον πρώην Γενικό Ελεγκτή Οδυσσέα Μιχαηλίδη.'
    },
    logo: '/parties/alma.png'
  },
  {
    id: 'ADK',
    name: {
      en: 'Direct Democracy Cyprus',
      el: 'Άμεση Δημοκρατία Κύπρου'
    },
    shortName: { en: 'ADK', el: 'ΑΔΚ' },
    leader: { en: 'Fidias Panayiotou', el: 'Φειδίας Παναγιώτου' },
    colour: '#ffffff',
    alignment: {
      en: 'Direct-democracy, anti-establishment',
      el: 'Άμεση δημοκρατία, αντι-κατεστημένο'
    },
    contested2021: false,
    seatsOutgoing: 0,
    newParty: true,
    notes: {
      en: 'Founded October 2025 by MEP Fidias Panayiotou; candidates selected via the Agorà mobile app.',
      el: 'Ιδρύθηκε τον Οκτώβριο 2025 από τον ευρωβουλευτή Φειδία Παναγιώτου· οι υποψήφιοι επιλέχθηκαν μέσω της εφαρμογής Agorà.'
    },
    logo: '/parties/adk.jpg'
  },
  {
    id: 'VOLT',
    name: {
      en: 'Volt Cyprus',
      el: 'Volt Κύπρου'
    },
    shortName: { en: 'Volt', el: 'Volt' },
    leader: {
      en: 'Andromache Sophocleous & Panos Loizou Parras',
      el: 'Ανδρομάχη Σοφοκλέους & Πάνος Λοΐζου Παρράς'
    },
    colour: '#6f1ab1',
    alignment: {
      en: 'Pan-European federalist, progressive',
      el: 'Πανευρωπαϊκό φεντεραλιστικό, προοδευτικό'
    },
    contested2021: false,
    seatsOutgoing: 1,
    newParty: true,
    notes: {
      en: 'First general-election test; one outgoing MP (Alexandra Attalides, switched from KOSP).',
      el: 'Πρώτη συμμετοχή σε βουλευτικές εκλογές· μία απερχόμενη βουλεύτρια (Αλεξάνδρα Ατταλίδου, αποσκίρτησε από ΚΟΣΠ).'
    },
    logo: '/parties/volt.svg'
  },
  {
    id: 'DEK',
    name: {
      en: 'Democratic National Movement',
      el: 'Δημοκρατικό Εθνικό Κίνημα'
    },
    shortName: { en: 'DEK', el: 'ΔΕΚ' },
    leader: { en: 'Andreas Themistocleous', el: 'Ανδρέας Θεμιστοκλέους' },
    colour: '#795548',
    alignment: {
      en: 'Religious-conservative, nationalist',
      el: 'Θρησκευτικό-συντηρητικό, εθνικιστικό'
    },
    contested2021: false,
    seatsOutgoing: 1,
    newParty: true,
    notes: {
      en: 'Founded January 2025 by former ELAM MP Andreas Themistokleous.',
      el: 'Ιδρύθηκε τον Ιανουάριο 2025 από τον πρώην βουλευτή του ΕΛΑΜ Ανδρέα Θεμιστοκλέους.'
    },
    logo: '/parties/dek.png'
  },
  {
    id: 'DIMAL',
    name: {
      en: 'Democratic Change',
      el: 'Δημοκρατική Αλλαγή'
    },
    shortName: { en: 'DIMAL', el: 'ΔΗΜΑΛ' },
    leader: { en: 'Christos Clerides', el: 'Χρήστος Κληρίδης' },
    colour: '#5c6bc0',
    alignment: {
      en: 'Centrist, reformist',
      el: 'Κεντρώο, μεταρρυθμιστικό'
    },
    contested2021: false,
    seatsOutgoing: 0,
    newParty: true,
    logo: '/parties/dimal.webp'
  },
  {
    id: 'KEKK',
    name: {
      en: 'Active Citizens – Movement of United Cypriot Hunters',
      el: 'Ενεργοί Πολίτες – Κίνημα Ενωμένων Κυπρίων Κυνηγών'
    },
    shortName: { en: 'KEKK (Hunters)', el: 'ΚΕΚΚ (Κυνηγοί)' },
    leader: { en: 'Nikolaos Prodromou', el: 'Νικόλαος Προδρόμου' },
    colour: '#558b2f',
    alignment: {
      en: 'Single-issue, pro-hunting',
      el: 'Μονοθεματικό, υπέρ του κυνηγιού'
    },
    contested2021: true,
    seatsOutgoing: 0,
    newParty: false,
    notes: {
      en: 'Polled 3.27% in 2021, missing the 3.6% threshold.',
      el: 'Έλαβε 3,27% το 2021, χάνοντας το όριο του 3,6%.'
    },
    logo: '/parties/kekk.png'
  },
  {
    id: 'LAKE',
    name: {
      en: 'Patriotic Front "Lakedaimonioi" (Spartans)',
      el: 'Πατριωτικό Μέτωπο «Λακεδαιμόνιοι»'
    },
    shortName: { en: 'Spartans', el: 'Λακεδαιμόνιοι' },
    leader: { en: 'Marianna Athanasiou', el: 'Μαριάννα Αθανασίου' },
    colour: '#3e2723',
    alignment: {
      en: 'Far-right',
      el: 'Άκρα δεξιά'
    },
    contested2021: false,
    seatsOutgoing: 0,
    newParty: true,
    logo: '/parties/lake.jpg'
  },
  {
    id: 'SIKOU',
    name: {
      en: '"Sikou Pano!" ("Get Up!")',
      el: '«Σήκου Πάνω!»'
    },
    shortName: { en: 'Sikou Pano', el: 'Σήκου Πάνω' },
    leader: { en: 'Christoforos Tornaritis', el: 'Χριστόφορος Τορναρίτης' },
    colour: '#f57c00',
    alignment: {
      en: 'Anti-establishment',
      el: 'Αντι-κατεστημένο'
    },
    contested2021: false,
    seatsOutgoing: 0,
    newParty: true,
    notes: {
      en: 'Founded January 2026; led by former Olympiakos Nicosia chairman.',
      el: 'Ιδρύθηκε τον Ιανουάριο 2026· επικεφαλής ο πρώην πρόεδρος του Ολυμπιακού Λευκωσίας.'
    },
    logo: '/parties/sikou.png'
  },
  {
    id: 'FARL',
    name: {
      en: 'Far-Left Resistance – Communism',
      el: 'Αντίσταση Άκρας Αριστεράς – Κομμουνισμός'
    },
    shortName: { en: 'Far-Left Resistance', el: 'Άκρα Αριστερά' },
    leader: { en: 'Celestina De Petro', el: 'Σελεστίνα Ντε Πέτρο' },
    colour: '#880e4f',
    alignment: {
      en: 'Far-left, communist',
      el: 'Άκρα αριστερά, κομμουνιστικό'
    },
    contested2021: false,
    seatsOutgoing: 0,
    newParty: true
  },
  {
    id: 'POPSF',
    name: {
      en: 'Popular Struggle for Freedom',
      el: 'Λαϊκός Αγώνας για την Ελευθερία'
    },
    shortName: { en: 'Popular Struggle', el: 'Λαϊκός Αγώνας' },
    leader: { en: 'Apostolos Apostolou', el: 'Απόστολος Αποστόλου' },
    colour: '#6d4c41',
    alignment: {
      en: 'Nationalist, populist',
      el: 'Εθνικιστικό, λαϊκίστικο'
    },
    contested2021: false,
    seatsOutgoing: 0,
    newParty: true
  },
  {
    id: 'AGRO',
    name: {
      en: "Agronomos – Agricultural Workers' Party",
      el: 'Αγρονόμος – Κόμμα Αγροτών'
    },
    shortName: { en: 'Agronomos', el: 'Αγρονόμος' },
    leader: { en: 'Andreas Christofi', el: 'Ανδρέας Χριστοφή' },
    colour: '#9e9d24',
    alignment: {
      en: 'Agrarian',
      el: 'Αγροτικό'
    },
    contested2021: false,
    seatsOutgoing: 0,
    newParty: true,
    logo: '/parties/agro.svg'
  },
  {
    id: 'GRNC',
    name: {
      en: 'Green Party of Cyprus',
      el: 'Πράσινο Κόμμα Κύπρου'
    },
    shortName: { en: 'Greens (GRNC)', el: 'Πράσινοι (GRNC)' },
    leader: { en: 'Kyriakos Andreou', el: 'Κυριάκος Ανδρέου' },
    colour: '#8bc34a',
    alignment: {
      en: 'Green, separate from KOSP',
      el: 'Πράσινο, ξεχωριστό από το ΚΟΣΠ'
    },
    contested2021: false,
    seatsOutgoing: 0,
    newParty: true,
    logo: '/parties/grnc.png'
  }
];

export function getParty(id: PartyId): Party {
  const party = PARTIES.find((p) => p.id === id);
  if (!party) {
    throw new Error(`Unknown party id: ${id}`);
  }
  return party;
}
