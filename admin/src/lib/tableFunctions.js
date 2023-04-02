export const handleInput = ( value, cell ) => {
	const newRow = cell.row.original;
	newRow[ cell.column.id ] = value;
	// console.log( newRow );
};
