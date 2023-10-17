import classNames from 'classnames';
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import { flexRender } from '@tanstack/react-table';

import useTableStore from '../hooks/useTableStore';

function TableCell( { cell, customSlug, isEditCell, closeableRowActions, resizable } ) {
	let slug = useTableStore( ( state ) => state.activeTable );

	if ( customSlug ) {
		slug = customSlug;
	}
	const sorting = useTableStore( ( state ) => state.tables[ slug ]?.sorting || [] );
	const openedRowActions = true;
	const isTooltip = cell.column.columnDef.tooltip && cell.getValue();
	const style = typeof cell?.column.columnDef?.style === 'function' ? cell?.column.columnDef?.style( cell ) : cell?.column.columnDef?.style || {};

	return (
		cell.column.getIsVisible() &&
		<td
			key={ cell.id }
			className={ classNames( [
				cell.column.columnDef.className,
				sorting.length && sorting[ 0 ].key === cell.column.columnDef.accessorKey ? 'highlight' : null,
				closeableRowActions && isEditCell && ! openedRowActions ? 'closed' : null,
			] ) }
			style={ {
				...style,
				width: cell.column.getSize() !== 0 && resizable
					? cell.column.getSize()
					: undefined,
			} }
		>
			{ /** its safe to use always Tooltip component, nullish values doesn't render tooltip */ }
			<Tooltip
				placement="bottom-start"
				title={
					isTooltip
						? <Box sx={ { maxWidth: '45rem' } }>{ flexRender( cell.column.columnDef.tooltip, cell.getContext() ) }</Box>
						: null
				}
			>
				<div className="limit">
					{ flexRender( cell.column.columnDef.cell, cell.getContext() ) }
				</div>
			</Tooltip>
		</td>
	);
}

function TableRow( { row, customSlug, resizable, closeableRowActions } ) {
	const visibleCells = row.getVisibleCells();

	return <tr className={ row.getIsSelected() ? 'selected' : '' }>
		{ visibleCells.map( ( cell, index ) => {
			const isEditCell = index === visibleCells.length - 1 && cell.column.id === 'editRow';

			return <TableCell cell={ cell } key={ index } isEditCell={ isEditCell } customSlug={ customSlug } resizable={ resizable } closeableRowActions={ closeableRowActions } />;
		} ) }
	</tr>;
}

export default TableRow;
