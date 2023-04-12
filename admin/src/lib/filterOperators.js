
export const numericOp = {
	exactly: 'is exactly',
	'<>': 'is not equal',
	IN: 'is one of',
	NOTIN: 'is not one of',
	BETWEEN: 'is between',
	'>': 'is larger than',
	'<': 'is smaller than',
};

export const dateOp = {
	exactly: 'is exactly',
	'<>': 'is not equal',
	// BETWEEN: 'is between', //Disabled for now
	'>': 'is after',
	'<': 'is before',
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
	NOTLIKE: 'doesn\'t contain',
	'NOTLIKE%': 'doesn\'t begin with',
	'NOT%LIKE': 'doesn\'t end with',
	exactly: 'is exactly',
	'<>': 'is not',
	IN: 'is one of',
	NOTIN: 'is not one of',
	'>': 'is longer than',
	'<': 'is shorter than',
};

export const booleanTypes = {
	true: 'Checked',
	false: 'Unchecked',
};

// Conditions to call different filter endpoint argument based on operator
export default function filterArgs( currentFilters ) {
	let filters = '';

	Object.entries( currentFilters ).map( ( [ key, filter ] ) => {
		const { op, val } = filter;
		if ( op && op === 'exactly' ) {
			filters += `&filter_${ key }=${ val }`;
		}
		if ( op && ( op === 'IN' || op === 'NOTIN' ) ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","val":[${ val }]}` ) }`;
		}
		if ( op && op === 'BETWEEN' ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","min":${ val.min }, "max": ${ val.max }}` ) }`;
		}
		if ( op && op !== 'IN' && op !== 'NOTIN' && op !== 'BETWEEN' && op !== 'exactly' ) {
			filters += `&filter_${ key }=${ encodeURIComponent( `{"op":"${ op }","val":"${ val }"}` ) }`;
		}
		return false;
	} );

	return filters;
}
