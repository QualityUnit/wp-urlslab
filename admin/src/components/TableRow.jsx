import { memo, useContext } from 'react';
import classNames from 'classnames';
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import { flexRender } from '@tanstack/react-table';

import useTableStore from '../hooks/useTableStore';
import { TableContext } from './TableComponent';

function TableRow( { row } ) {
	const { resizable, userCustomSettings, closeableRowActions } = useContext( TableContext );

	const visibleCells = row.getVisibleCells();
	const sorting = useTableStore( ( state ) => state.sorting );
	console.log( 'a' );

	return <tr className={ row.getIsSelected() ? 'selected' : '' }>
		{ visibleCells.map( ( cell, index ) => {
			const isTooltip = cell.column.columnDef.tooltip && cell.getValue();
			const isEditCell = index === visibleCells.length - 1 && cell.column.id === 'editRow';
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
		} ) }
	</tr>;
}

export default memo( TableRow );
