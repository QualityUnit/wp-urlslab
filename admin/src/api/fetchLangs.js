import { langName } from '../lib/helpers';

export const langCodes = [
	'en',
	'zh',
	'zh-hans',
	'es',
	'ar',
	'pt',
	'pt-br',
	'id',
	'fr',
	'ja',
	'ru',
	'de',
	'ko',
	'ta',
	'tr',
	'it',
	'pl',
	'nl',
	'da',
	'no',
	'sv',
	'fi',
	'el',
	'cs',
	'hu',
	'he',
	'th',
	'uk',
	'ca',
	'ro',
	'vi',
	'bg',
	'hi',
	'fa',
	'sk',
	'sl',
	'lt',
	'lv',
	'hr',
	'et',
	'sr',
	'ms',
	'is',
	'sw',
	'sq',
	'mk',
	'be',
	'bs',
	'ka',
	'af',
	'cy',
	'mt',
	'tl',
	'fil',
	'co',
	'si',
	'sq',
];

export function fetchLangs( ) {
	const langPairs = {};
	langCodes.forEach( ( lang ) => {
		langPairs[ lang ] = langName( lang );
	} );
	return langPairs;
}

// format output for MUI Joy Autocomplete component
export function fetchLangsForAutocomplete( ) {
	const langPairs = {};
	langCodes.forEach( ( lang ) => {
		langPairs[ lang ] = { label: langName( lang ), id: lang };
	} );
	return langPairs;
}
