import { memo, useContext } from 'react';
import classNames from 'classnames';
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import { flexRender } from '@tanstack/react-table';

import useTableStore from '../hooks/useTableStore';
import { TableContext } from './TableComponent';

const TableCell = memo( function TableCell( { cell, isEditCell } ) {
	const { resizable, userCustomSettings, closeableRowActions } = useContext( TableContext );
	const sorting = useTableStore( ( state ) => state.sorting );
	const isTooltip = cell.column.columnDef.tooltip && cell.getValue();

	return (
		cell.column.getIsVisible() &&
		<td
			key={ cell.id }
			className={ classNames( [
				cell.column.columnDef.className,
				sorting.length && sorting[ 0 ].key === cell.column.columnDef.accessorKey ? 'highlight' : null,
				closeableRowActions && isEditCell && ! userCustomSettings.openedRowActions ? 'closed' : null,
			] ) }
			style={ {
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
} );

function TableRow( { row } ) {
	const visibleCells = row.getVisibleCells();

	return <tr className={ row.getIsSelected() ? 'selected' : '' }>
		{ visibleCells.map( ( cell, index ) => {
			const isEditCell = index === visibleCells.length - 1 && cell.column.id === 'editRow';

			return <TableCell cell={ cell } key={ index } isEditCell={ isEditCell } />;
		} ) }
	</tr>;
}

export default memo( TableRow );
