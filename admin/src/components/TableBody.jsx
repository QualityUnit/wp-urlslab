import { useEffect, memo, useContext, useMemo } from 'react';

import { useVirtual } from 'react-virtual';
import TableRow from './TableRow';
import { TableContext } from './TableComponent';

const TableBody = ( ) => {
	const tbody = [];
	const { tableContainerRef, table, userCustomSettings, closeableRowActions } = useContext( TableContext );

	const { rows } = table?.getRowModel();

	const rowVirtualizer = useVirtual( {
		parentRef: tableContainerRef,
		size: rows?.length,
		overscan: 10,
	} );

	const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

	const paddingTop = useMemo( () => virtualRows?.length > 0 ? virtualRows?.[ 0 ]?.start || 0 : 0, [ virtualRows ] );
	const paddingBottom = useMemo( () => virtualRows?.length > 0
		? totalSize - ( virtualRows?.[ virtualRows.length - 1 ]?.end || 0 )
		: 0
	, [ totalSize, virtualRows ] );

	// set width of edit columns dynamically according to currently loaded table rows, no always are visible all items in RowActionButtons component
	useEffect( () => {
		if ( ! closeableRowActions || ( closeableRowActions && userCustomSettings.openedRowActions ) ) {
			const nodes = tableContainerRef.current?.querySelectorAll( 'table.urlslab-table tbody td.editRow .action-buttons-wrapper' );
			const actionWrappers = nodes ? Object.values( nodes ) : [];
			let finalWidth = 0;
			for ( const w in actionWrappers ) {
				const wrapper = actionWrappers[ w ];
				finalWidth = finalWidth >= wrapper.offsetWidth ? finalWidth : wrapper.offsetWidth;
			}
			tableContainerRef.current?.style.setProperty( '--Table-editRowColumnWidth', `${ finalWidth }px` );
		}
	}, [ closeableRowActions, userCustomSettings.openedRowActions, rowVirtualizer.virtualItems, tableContainerRef ] );

	for ( const virtualRow of virtualRows ) {
		const row = rows[ virtualRow?.index ];
		tbody.push(
			<TableRow key={ row.id } row={ row } />
		);
	}

	return (
		<tbody className="urlslab-table-body" >
			{ paddingTop > 0 && (
				<tr>
					<td style={ { height: `${ paddingTop }px` } } />
				</tr>
			) }
			{ tbody }
			{ paddingBottom > 0 && (
				<tr>
					<td style={ { height: `${ paddingBottom }px` } } />
				</tr>
			) }
		</tbody>
	);
};

export default memo( TableBody );
