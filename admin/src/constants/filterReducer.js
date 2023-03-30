
export default function filterReducer( state, action ) {
	const { filterObj } = state;

	switch ( action.type ) {
		case 'setFilterKey':
			return {
				...state,
				filterObj: { ...filterObj, filterKey: action.key },
			};
		case 'setFilterOp':
			return {
				...state,
				filterObj: { ...filterObj, filterOp: action.op },
			};
		case 'setFilterVal':
			return {
				...state,
				filterObj: { ...filterObj, filterVal: action.val },
			};
		case 'setNumeric':
			return {
				...state,
				filterObj: { ...filterObj, isNumber: action.isNumber },
			};
		case 'setCurrentFilters':
			return {
				...state,
				currentFilters: action.currentFilters,
			};
		case 'setFilteringState':
			return {
				...state,
				filteringState: action.filteringState,
			};
		case 'possibleFilters':
			return {
				...state,
				possibleFilters: action.possibleFilters,
			};
		case 'toggleEditFilter':
			return {
				...state,
				editFilter: action.editFilter,
			};
		default:
			return state;
	}
}

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
