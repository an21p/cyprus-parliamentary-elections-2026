import type { LayoutLoad } from './$types';
import type { Lang } from '$i18n/dict';

export const prerender = true;

export const load: LayoutLoad = ({ params, url }) => {
  return {
    lang: params.lang as Lang,
    currentPath: url.pathname
  };
};
