
export const numericOp = {
	exactly: 'is exactly',
	'<>': 'is not equal',
	IN: 'is one of',
	BETWEEN: 'is between',
	'>': 'is larger than',
	'<': 'is smaller than',
};

export const menuOp = {
	exactly: 'is',
	'<>': 'is not',
};

export const langOp = {
	exactly: 'is',
	'<>': 'is not',
	// IN: 'is one of',
};

export const stringOp = {
	LIKE: 'contains',
	'LIKE%': 'begins with',
	'%LIKE': 'ends with',
	exactly: 'is exactly',
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
		if ( op && op === 'exactly' ) {
			filters += `&filter_${ key }=${ val }`;
		}
		if ( op && op === 'IN' ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","val":[${ val }]}` ) }`;
		}
		if ( op && op === 'BETWEEN' ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","min":${ val.min }, "max": ${ val.max }}` ) }`;
		}
		if ( op && op !== 'IN' && op !== 'BETWEEN' && op !== 'exactly' ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","val":"${ val }"}` ) }`;
		}
		return false;
	} );

	return filters;
}
