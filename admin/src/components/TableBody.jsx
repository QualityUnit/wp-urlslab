import { useEffect, memo } from 'react';

import TableRow from './TableRow';

const TableBody = ( { customSlug, table, tableContainerRef } ) => {
	const tbody = [];

	const { rows } = table?.getRowModel();

	for ( const row of rows ) {
		tbody.push(
			<TableRow key={ row.id } row={ row } customSlug={ customSlug } />
		);
	}

	console.log( table?.getRowModel() );

	// // set width of edit columns dynamically according to currently loaded table rows, no always are visible all items in RowActionButtons component
	useEffect( () => {
		const nodes = tableContainerRef.current?.querySelectorAll( 'table.urlslab-table tbody td.editRow .action-buttons-wrapper' );
		const actionWrappers = nodes ? Object.values( nodes ) : [];
		let finalWidth = 0;
		for ( const w in actionWrappers ) {
			const wrapper = actionWrappers[ w ];
			finalWidth = finalWidth >= wrapper.offsetWidth ? finalWidth : wrapper.offsetWidth;
		}
		tableContainerRef.current?.style.setProperty( '--Table-editRowColumnWidth', `${ finalWidth }px` );
	}, [ tableContainerRef ] );

	return (
		<tbody className="urlslab-table-body" >
			{ tbody }
		</tbody>
	);
};

export default memo( TableBody );
