export default function filtersArray( userFilters ) {
	const arrayOfFilters = userFilters ? Object.entries( userFilters ).map( ( [ col, params ] ) => {
		const { op, val } = params;
		return { col, op, val };
	} ) : [];

	return arrayOfFilters;
}
