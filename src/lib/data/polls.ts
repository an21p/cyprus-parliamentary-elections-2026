import type { PollEntry } from './types';

export const POLLS: PollEntry[] = [
  {
    fieldworkStart: '2026-05-01',
    fieldworkEnd: '2026-05-11',
    pollster: 'Prime Consulting',
    commissioner: 'SIGMA ("Χωρίς Περιστροφές")',
    sample: 1136,
    marginOfError: 3.0,
    shares: {
      DISY: 18.0,
      AKEL: 17.6,
      ELAM: 10.0,
      ALMA: 8.0,
      ADK: 6.2,
      DIKO: 7.4,
      VOLT: 3.6
    },
    notes:
      'After valid-vote redistribution: DISY 18.8 / AKEL 18.3 / ELAM 10.4 / ALMA 8.3. Refused 7.3%.',
    seatProjection: {
      DISY: [13, 15],
      AKEL: [12, 14],
      ELAM: [7, 9],
      ALMA: [6, 7],
      ADK: [6, 7],
      DIKO: [5, 6],
      VOLT: [2, 4]
    },
    undecidedPct: 10.3
  },
  {
    fieldworkStart: '2026-05-02',
    fieldworkEnd: '2026-05-09',
    pollster: 'RAI Consultants',
    commissioner: 'Alpha Cyprus (5th & final RAI/Alpha poll)',
    sample: 1332,
    marginOfError: 2.7,
    shares: {
      DISY: 18.2,
      AKEL: 15.2,
      ELAM: 10.7,
      ALMA: 5.8,
      ADK: 4.4,
      DIKO: 7.2
    },
    notes: 'On valid votes: DISY 24.5 / AKEL 20.5 / ELAM 14.4.',
    seatProjection: {
      DISY: 15,
      AKEL: 13,
      ELAM: 9,
      DIKO: 6,
      ALMA: 6,
      ADK: 4,
      VOLT: 3
    },
    undecidedPct: 26.3
  },
  {
    fieldworkStart: '2026-05-05',
    fieldworkEnd: '2026-05-07',
    pollster: 'Explorer',
    commissioner: 'Phileleftheros',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 19.7,
      AKEL: 18.8,
      ELAM: 11.6,
      ALMA: 8.3,
      ADK: 6.7,
      DIKO: 8.3,
      VOLT: 3.2
    },
    notes:
      'DISY/AKEL figures after redistribution. Regional: ELAM 22% in Famagusta; AKEL 23% in Larnaca; DISY 23% in Paphos.'
  },
  {
    fieldworkStart: '2026-05-01',
    fieldworkEnd: '2026-05-07',
    pollster: 'RealPolls',
    commissioner: 'independent',
    sample: 1555,
    marginOfError: null,
    shares: {
      DISY: 19.7,
      AKEL: 17.5,
      ELAM: 14.0,
      ALMA: 9.4,
      ADK: 8.7,
      DIKO: 7.8,
      VOLT: 7.2,
      EDEK: 3.9,
      DIPA: 3.7,
      KOSP: 2.7,
      KEKK: 2.8
    },
    notes: 'Outlier: lowest DISY+AKEL ever recorded; Volt as high as 7.2%.'
  },
  {
    fieldworkStart: '2026-04-24',
    fieldworkEnd: '2026-05-03',
    pollster: 'Stratego-IMR',
    commissioner: 'Kathimerini Cyprus',
    sample: null,
    marginOfError: null,
    shares: {
      ALMA: 8.9,
      ADK: 5.7,
      DIKO: 7.4,
      VOLT: 4.2,
      EDEK: 2.3,
      DIPA: 1.2,
      KOSP: 2.1,
      KEKK: 1.2
    },
    notes:
      'DISY/AKEL/ELAM shares not reported in source. Volt up sharply vs December; ADK at lowest poll figure since founding.'
  },
  {
    fieldworkStart: '2026-04-07',
    fieldworkEnd: '2026-04-21',
    pollster: 'RAI Consultants',
    commissioner: 'Alpha Cyprus',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 21.3,
      AKEL: 21.7,
      ELAM: 13.9,
      ALMA: 9.1,
      ADK: 10.3,
      DIKO: 7.7,
      VOLT: 5.1,
      EDEK: 3.2,
      DIPA: 1.8,
      KOSP: 2.6,
      KEKK: 2.8
    },
    notes: 'AKEL leads by 0.4.'
  },
  {
    fieldworkStart: '2026-04-14',
    fieldworkEnd: '2026-04-17',
    pollster: 'Prime Consulting',
    commissioner: 'SIGMA',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 23.3,
      AKEL: 23.3,
      ELAM: 13.8,
      ALMA: 11.9,
      ADK: 9.4,
      DIKO: 9.4,
      VOLT: 3.8,
      EDEK: 1.3,
      DIPA: 2.5,
      KOSP: 1.3
    },
    notes: 'Tie at the top.'
  },
  {
    fieldworkStart: '2026-04-06',
    fieldworkEnd: '2026-04-17',
    pollster: 'CYMAR',
    commissioner: 'ANT1',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 22,
      AKEL: 21,
      ELAM: 13,
      ALMA: 8,
      ADK: 9,
      DIKO: 12,
      VOLT: 4,
      EDEK: 4,
      DIPA: 2,
      KOSP: 2,
      KEKK: 2
    },
    undecidedPct: 17
  },
  {
    fieldworkStart: '2026-03-30',
    fieldworkEnd: '2026-04-06',
    pollster: 'Explorer',
    commissioner: 'Phileleftheros',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 23.2,
      AKEL: 22.5,
      ELAM: 14.0,
      ALMA: 13.4,
      ADK: 7.4,
      DIKO: 9.6,
      VOLT: 2.6,
      EDEK: 2.8,
      DIPA: 1.3,
      KOSP: 1.3
    }
  },
  {
    fieldworkStart: '2026-03-10',
    fieldworkEnd: '2026-03-26',
    pollster: 'MRC Cypronetwork',
    commissioner: 'RIK / CyBC',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 22.8,
      AKEL: 22.8,
      ELAM: 14.6,
      ALMA: 9.5,
      ADK: 7.0,
      DIKO: 9.5,
      VOLT: 3.2,
      EDEK: 3.2,
      DIPA: 1.3,
      KOSP: 3.2,
      KEKK: 1.3
    },
    notes: 'Tie at the top.',
    seatProjection: {
      AKEL: 15,
      DISY: 15,
      ELAM: 10,
      ALMA: 6,
      DIKO: 6,
      ADK: 4
    }
  },
  {
    fieldworkStart: '2026-03-06',
    fieldworkEnd: '2026-03-14',
    pollster: 'CYMAR',
    commissioner: 'ANT1',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 21,
      AKEL: 21,
      ELAM: 13,
      ALMA: 12,
      ADK: 9,
      DIKO: 12,
      VOLT: 4,
      EDEK: 4,
      DIPA: 1,
      KOSP: 2,
      KEKK: 1
    },
    notes: 'Tie at the top.'
  },
  {
    fieldworkStart: '2026-02-26',
    fieldworkEnd: '2026-03-11',
    pollster: 'Noverna',
    commissioner: 'independent',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 22.5,
      AKEL: 22.2,
      ELAM: 13.4,
      ALMA: 12.2,
      ADK: 9.8,
      DIKO: 9.5,
      VOLT: 3.4,
      EDEK: 2.0,
      DIPA: 1.1,
      KOSP: 1.7,
      KEKK: 1.5
    }
  },
  {
    fieldworkStart: '2026-02-11',
    fieldworkEnd: '2026-02-27',
    pollster: 'CyBC in-house',
    commissioner: 'CyBC',
    sample: 1417,
    marginOfError: null,
    shares: {
      DISY: 18,
      AKEL: 17.5,
      ELAM: 12,
      ALMA: 8.5,
      ADK: 7,
      DIKO: 6.5,
      VOLT: 3
    },
    notes: 'Voting certainty 86%.'
  },
  {
    fieldworkStart: '2026-02-17',
    fieldworkEnd: '2026-02-25',
    pollster: 'Explorer',
    commissioner: 'Phileleftheros',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 22.5,
      AKEL: 22.0,
      ELAM: 15.0,
      ALMA: 12.2,
      ADK: 8.8,
      DIKO: 8.9,
      VOLT: 2.6,
      EDEK: 2.6,
      DIPA: 1.3,
      KOSP: 1.3
    }
  },
  {
    fieldworkStart: '2026-02-09',
    fieldworkEnd: '2026-02-17',
    pollster: 'RAI Consultants',
    commissioner: 'Alpha Cyprus',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 21.5,
      AKEL: 22.7,
      ELAM: 16.4,
      ALMA: 10.0,
      ADK: 8.1,
      DIKO: 9.4,
      VOLT: 3.8,
      EDEK: 2.3,
      DIPA: 2.8,
      KOSP: 2.0,
      KEKK: 0.8
    },
    notes: 'AKEL leads.'
  },
  {
    fieldworkStart: '2026-02-06',
    fieldworkEnd: '2026-02-14',
    pollster: 'Prime Consulting',
    commissioner: 'SIGMA',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 22.4,
      AKEL: 23.1,
      ELAM: 15.4,
      ALMA: 12.8,
      ADK: 8.3,
      DIKO: 9.0,
      VOLT: 2.6,
      EDEK: 2.6,
      DIPA: 1.3,
      KOSP: 1.3
    }
  },
  {
    fieldworkStart: '2026-01-10',
    fieldworkEnd: '2026-01-16',
    pollster: 'RAI Consultants',
    commissioner: 'Alpha Cyprus',
    sample: 1031,
    marginOfError: null,
    shares: {
      DISY: 22.8,
      AKEL: 21.8,
      ELAM: 16.5,
      ALMA: 10.5,
      ADK: 10.1,
      DIKO: 7.9,
      VOLT: 4.0,
      EDEK: 1.5,
      DIPA: 1.6,
      KOSP: 1.0,
      KEKK: 1.3
    },
    notes: 'First mention of ADK at 10.1%.'
  },
  {
    fieldworkStart: '2026-01-12',
    fieldworkEnd: '2026-01-27',
    pollster: 'MRC Cypronetwork',
    commissioner: 'RIK',
    sample: 1213,
    marginOfError: null,
    shares: {
      DISY: 17,
      AKEL: 16,
      ELAM: 11,
      ALMA: 9,
      ADK: 6.5,
      DIKO: 6,
      VOLT: 2,
      EDEK: 2.5,
      DIPA: 1,
      KOSP: 2.5,
      KEKK: 1
    },
    notes: 'High undecided + abstainers.'
  },
  {
    fieldworkStart: '2025-11-27',
    fieldworkEnd: '2025-12-03',
    pollster: 'Stratego-IMR',
    commissioner: 'Kathimerini Cyprus',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 23.5,
      AKEL: 22.3,
      ELAM: 16.4,
      ALMA: 10.0,
      ADK: 9.2,
      DIKO: 8.1,
      VOLT: 2.4,
      EDEK: 2.1,
      DIPA: 1.3,
      KOSP: 2.3,
      KEKK: 1.4
    }
  },
  {
    fieldworkStart: '2025-09-29',
    fieldworkEnd: '2025-10-17',
    pollster: 'MRC Cypronetwork',
    commissioner: 'RIK / CyBC',
    sample: 1422,
    marginOfError: null,
    shares: {
      DISY: 17,
      AKEL: 17,
      ELAM: 11.5,
      ALMA: 6,
      ADK: 6.5,
      DIKO: 7.5
    },
    notes: 'Published 15 Nov 2025. ELAM consolidation 79%.'
  },
  {
    fieldworkStart: '2025-11-04',
    fieldworkEnd: '2025-11-13',
    pollster: 'Pulse Market Research',
    commissioner: 'Omega Channel',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 23.2,
      AKEL: 20.3,
      ELAM: 13.0,
      ALMA: 10.1,
      ADK: 8.7,
      DIKO: 8.7,
      VOLT: 2.9,
      EDEK: 2.9,
      DIPA: 1.4,
      KOSP: 2.9,
      KEKK: 1.4
    },
    notes: 'ALMA 6–8 seats in Pulse scenarios.'
  },
  {
    fieldworkStart: '2025-11-03',
    fieldworkEnd: '2025-11-10',
    pollster: 'IMR',
    commissioner: 'Reporter',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 22.1,
      AKEL: 21.3,
      ELAM: 16.2,
      ALMA: 12.2,
      ADK: 6.9,
      DIKO: 8.6,
      VOLT: 3.7,
      EDEK: 2.3,
      DIPA: 1.2,
      KOSP: 3.0,
      KEKK: 1.6
    }
  },
  {
    fieldworkStart: '2025-09-29',
    fieldworkEnd: '2025-10-17',
    pollster: 'MRC Cypronetwork',
    commissioner: 'RIK',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 23.1,
      AKEL: 23.1,
      ELAM: 15.6,
      ALMA: 8.2,
      ADK: 6.1,
      DIKO: 10.2,
      VOLT: 2.0,
      EDEK: 3.4,
      DIPA: 1.4,
      KOSP: 2.7,
      KEKK: 2.0
    },
    notes: 'Tie at the top.'
  },
  {
    fieldworkStart: '2025-09-22',
    fieldworkEnd: '2025-09-29',
    pollster: 'Prime Consulting',
    commissioner: 'SIGMA',
    sample: 1144,
    marginOfError: null,
    shares: {
      DISY: 18.5,
      AKEL: 18
    },
    notes: 'Voting-certainty poll; other parties not reported.'
  },
  {
    fieldworkStart: '2025-09-12',
    fieldworkEnd: '2025-09-22',
    pollster: 'Stratego-IMR',
    commissioner: 'Kathimerini Cyprus',
    sample: 800,
    marginOfError: null,
    shares: {
      DISY: 22.7,
      AKEL: 23.9,
      ELAM: 15.9,
      ALMA: 12.5,
      ADK: 3.4,
      DIKO: 9.1,
      VOLT: 2.3,
      EDEK: 1.1,
      DIPA: 1.1,
      KOSP: 2.3,
      KEKK: 1.1
    },
    notes:
      'First major poll after ALMA launch. Seat projection in source: DISY 20, AKEL 21, ELAM 14, ALMA 11, DIKO 8, VOLT 2, EDEK 1, DIPA 1, KOSP 2.',
    seatProjection: {
      DISY: 20,
      AKEL: 21,
      ELAM: 14,
      ALMA: 11,
      DIKO: 8,
      VOLT: 2,
      EDEK: 1,
      DIPA: 1,
      KOSP: 2
    }
  },
  {
    fieldworkStart: '2025-08-11',
    fieldworkEnd: '2025-08-11',
    pollster: 'Cypronet',
    commissioner: 'online',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 21.9,
      AKEL: 23.3,
      ELAM: 17.8,
      ALMA: 12.3,
      DIKO: 8.2,
      VOLT: 2.7,
      EDEK: 2.7,
      DIPA: 1.4,
      KOSP: 2.7,
      KEKK: 2.7
    }
  },
  {
    fieldworkStart: '2025-07-01',
    fieldworkEnd: '2025-07-08',
    pollster: 'Symmetron Market Research',
    commissioner: 'independent',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 23.2,
      AKEL: 20.5,
      ELAM: 16.4,
      ALMA: 15.1,
      DIKO: 8.2,
      VOLT: 2.7,
      EDEK: 4.1,
      DIPA: 1.4,
      KOSP: 2.7
    },
    notes: 'ALMA poll-debut at 15%+.'
  },
  {
    fieldworkStart: '2025-06-24',
    fieldworkEnd: '2025-06-28',
    pollster: 'IMR',
    commissioner: 'independent',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 22.2,
      AKEL: 23.5,
      ELAM: 16.0,
      ALMA: 14.8,
      DIKO: 8.6,
      VOLT: 3.7,
      EDEK: 2.5,
      DIPA: 1.2,
      KOSP: 3.7,
      KEKK: 1.2
    }
  },
  {
    fieldworkStart: '2025-06-13',
    fieldworkEnd: '2025-06-24',
    pollster: 'Unitrustmedia',
    commissioner: 'Vouli TV',
    sample: 2460,
    marginOfError: null,
    shares: {
      ELAM: 17,
      ALMA: 20,
      VOLT: 6
    },
    notes:
      'Online panel; ALMA hypothetically 20% (treated as outlier). DISY/AKEL not reported.'
  },
  {
    fieldworkStart: '2025-03-10',
    fieldworkEnd: '2025-03-21',
    pollster: 'Redwolf',
    commissioner: 'independent',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 25.0,
      AKEL: 20.0,
      ELAM: 16.25,
      ALMA: 11.25,
      DIKO: 10.0,
      VOLT: 5.0,
      EDEK: 3.75,
      DIPA: 1.25,
      KOSP: 5.0
    }
  },
  {
    fieldworkStart: '2025-03-05',
    fieldworkEnd: '2025-03-11',
    pollster: 'IMR',
    commissioner: 'independent',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 24.0,
      AKEL: 21.5,
      ELAM: 16.5,
      ALMA: 13.9,
      DIKO: 8.9,
      VOLT: 3.8,
      EDEK: 2.5,
      DIPA: 1.3,
      KOSP: 3.8,
      KEKK: 1.3
    }
  },
  {
    fieldworkStart: '2024-10-21',
    fieldworkEnd: '2024-11-01',
    pollster: 'RAI Consultants',
    commissioner: 'independent',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 27.9,
      AKEL: 25.8,
      ELAM: 14.5,
      DIKO: 11.4,
      VOLT: 5.7,
      EDEK: 4.0,
      KOSP: 1.6,
      KEKK: 1.4
    },
    notes: 'Pre-ALMA.'
  },
  {
    fieldworkStart: '2024-10-14',
    fieldworkEnd: '2024-10-16',
    pollster: 'RetailZoom',
    commissioner: 'Politis',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 23.5,
      AKEL: 11.1,
      ELAM: 9.9,
      ALMA: 20.1,
      DIKO: 3.7,
      VOLT: 14.8,
      EDEK: 1.2,
      DIPA: 1.2,
      KOSP: 2.5
    },
    notes:
      'Hypothetical-Michaelides-party scenario (ALMA = 20.1%); AKEL very low.'
  },
  {
    fieldworkStart: '2024-09-25',
    fieldworkEnd: '2024-10-05',
    pollster: 'Symmetron',
    commissioner: 'independent',
    sample: null,
    marginOfError: null,
    shares: {
      DISY: 28.8,
      AKEL: 25.0,
      ELAM: 14.1,
      DIKO: 10.9,
      VOLT: 3.2,
      EDEK: 4.3,
      DIPA: 3.4,
      KOSP: 3.6
    }
  }
];
