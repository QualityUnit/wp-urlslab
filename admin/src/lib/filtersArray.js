export default function filtersArray( userFilters ) {
	const arrayOfFilters = userFilters ? Object.entries( userFilters ).map( ( [ col, params ] ) => {
		const { op, val } = params;
		return { col: col.replace( /(.+?)@\d+/, '$1' ), op, val };
	} ) : [];

	return arrayOfFilters;
}
