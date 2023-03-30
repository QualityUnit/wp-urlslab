
export const numericOp = {
	'': 'is exactly',
	'<>': 'is not equal',
	IN: 'is one of',
	BETWEEN: 'is between',
	'>': 'is larger than',
	'<': 'is smaller than',
};

export const stringOp = {
	LIKE: 'contains',
	'LIKE%': 'begins with',
	'%LIKE': 'ends with',
	'': 'is exactly',
	'<>': 'is not',
	IN: 'is one of',
	'>': 'is longer than',
	'<': 'is shorter than',
};

// Conditions to call different filter endpoint argument based on operator
export default function filterArgs( currentFilters ) {
	let filters = '';

	Object.entries( currentFilters ).map( ( [ key, filter ] ) => {
		const { op, val } = filter;
		if ( ! op ) {
			filters += `&filter_${ key }=${ filter }`;
		}
		if ( op && op !== 'IN' && op !== 'BETWEEN' ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","val":"${ val }"}` ) }`;
		}
		if ( op && op === 'IN' ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","val":[${ val }]}` ) }`;
		}
		if ( op && op === 'BETWEEN' ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","min":${ val.min }, "max": ${ val.max }}` ) }`;
		}
		return false;
	} );

	return filters;
}
