import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string): param is 'en' | 'el' => {
  return param === 'en' || param === 'el';
};
