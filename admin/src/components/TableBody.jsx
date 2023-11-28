import { useEffect, memo, useContext } from 'react';

import TableRow from './TableRow';
import { TableContext } from './TableComponent';

const TableBody = ( ) => {
	const tbody = [];
	const { tableContainerRef, table, slug, userCustomSettings, closeableRowActions } = useContext( TableContext );

	const { rows } = table?.getRowModel();

	// set width of edit columns dynamically according to currently loaded table rows, no always are visible all items in RowActionButtons component
	useEffect( () => {
		const nodes = tableContainerRef.current?.querySelectorAll( 'table.urlslab-table tbody td.editRow .action-buttons-wrapper' );
		const actionWrappers = nodes ? Object.values( nodes ) : [];
		let finalWidth = 0;
		const lastScroll = 0;
		const containerWidth = Number( tableContainerRef.current?.style.getPropertyValue( '--tableContainerWidth' ).replace( 'px', '' ) );
		for ( const w in actionWrappers ) {
			const wrapper = actionWrappers[ w ];
			finalWidth = finalWidth >= wrapper.offsetWidth ? finalWidth : wrapper.offsetWidth;
		}
		tableContainerRef.current?.style.setProperty( '--Table-editRowColumnWidth', `${ finalWidth }px` );
		tableContainerRef.current?.style.setProperty( '--Table-editRowBackgroundPosition', `${ finalWidth }px` );

		// tableContainerRef.current.addEventListener( 'scroll', () => {
		// 	if ( ! userCustomSettings.openedRowActions ) {
		// 		if ( lastScroll !== tableContainerRef.current?.scrollLeft && tableContainerRef.current?.scrollLeft >= containerWidth - tableContainerRef.current?.clientWidth ) {
		// 			tableContainerRef.current.scrollLeft = containerWidth - tableContainerRef.current?.clientWidth;
		// 		} else {
		// 			tableContainerRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
		// 		}
		// 	} else {
		// 		tableContainerRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
		// 	}
		// } );
		// tableContainerRef.current.removeEventListener( 'scroll', null, true );
	}, [ closeableRowActions, userCustomSettings.openedRowActions, tableContainerRef ] );

	for ( const row of rows ) {
		tbody.push(
			<TableRow key={ row.id } row={ row } slug={ slug } />
		);
	}

	return (
		<tbody className="urlslab-table-body" >
			{ tbody }
		</tbody>
	);
};

export default memo( TableBody );
