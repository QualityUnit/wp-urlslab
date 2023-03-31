
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
		case 'setKeyType':
			return {
				...state,
				filterObj: { ...filterObj, keyType: action.keyType },
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
