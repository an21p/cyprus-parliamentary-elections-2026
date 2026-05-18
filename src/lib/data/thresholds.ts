import type { Bilingual, ThresholdSet } from './types';

export const THRESHOLDS: ThresholdSet = {
  singleParty: 3.6,
  twoPartyCoalition: 10,
  largeCoalition: 20,
  residual: 7.2
};

export const THRESHOLD_DESCRIPTIONS: Record<keyof ThresholdSet, Bilingual> = {
  singleParty: {
    en: 'Minimum nationwide vote share (3.6%) a single party must reach to participate in the second distribution. Raised from 1.8% by the 2015 reform.',
    el: 'Ελάχιστο πανεθνικό ποσοστό (3,6%) που πρέπει να συγκεντρώσει ένα κόμμα για να συμμετάσχει στη δεύτερη κατανομή. Διπλασιάστηκε από 1,8% με τη μεταρρύθμιση του 2015.'
  },
  twoPartyCoalition: {
    en: 'Minimum nationwide vote share (10%) a two-party coalition must reach to participate in the second distribution.',
    el: 'Ελάχιστο πανεθνικό ποσοστό (10%) που πρέπει να συγκεντρώσει συνασπισμός δύο κομμάτων για να συμμετάσχει στη δεύτερη κατανομή.'
  },
  largeCoalition: {
    en: 'Minimum nationwide vote share (20%) a coalition of three or more parties must reach to participate in the second distribution.',
    el: 'Ελάχιστο πανεθνικό ποσοστό (20%) που πρέπει να συγκεντρώσει συνασπισμός τριών ή περισσοτέρων κομμάτων για να συμμετάσχει στη δεύτερη κατανομή.'
  },
  residual: {
    en: 'Minimum nationwide vote share (7.2%) required to receive residual seats in the third distribution.',
    el: 'Ελάχιστο πανεθνικό ποσοστό (7,2%) που απαιτείται για τη λήψη υπολειπόμενων εδρών στην τρίτη κατανομή.'
  }
};
