import type { PollEntry } from './types';

// Each poll lives in its own JSON file under ./polls/.
// Vite bundles them at build time via import.meta.glob (eager) - no runtime fetch.
// Add a new poll by dropping a JSON file in that folder; nothing else to wire up.
const modules = import.meta.glob<PollEntry>('./polls/*.json', {
  eager: true,
  import: 'default'
});

export const POLLS: PollEntry[] = Object.values(modules).sort((a, b) =>
  a.fieldworkEnd === b.fieldworkEnd
    ? b.fieldworkStart.localeCompare(a.fieldworkStart)
    : b.fieldworkEnd.localeCompare(a.fieldworkEnd)
);
