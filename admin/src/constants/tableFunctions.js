export const handleInput = ( value, cell ) => {
	const newRow = cell.row.original;
	newRow[ cell.column.id ] = value;
	// console.log( newRow );
};

export const handleSelected = ( val, cell, rowSelector ) => {
	cell.row.toggleSelected();
	// console.log( { selected: cell.row.original[ rowSelector ] } );
};
