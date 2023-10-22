import { useContext, useMemo, memo } from 'react';
import classNames from 'classnames';
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import { flexRender } from '@tanstack/react-table';

import useTableStore from '../hooks/useTableStore';
import { TableContext } from './TableComponent';
import useSelectRows from '../hooks/useSelectRows';

const TableCellCheckbox = memo( ( { cell, rowId } ) => {
	const isSelected = useIsSelected( rowId );
	const isTooltip = cell.column.columnDef.tooltip && cell.getValue();
	const style = typeof cell?.column.columnDef?.style === 'function' ? cell?.column.columnDef?.style( cell ) : cell?.column.columnDef?.style || {};

	return (
		cell.column.getIsVisible() &&
		<td
			key={ cell.id }
			className={ classNames( [
				cell.column.columnDef.className,
				isSelected ? 'selected' : null,
			] ) }
			style={ {
				...style,
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

function TableCell( { cell, isEditCell } ) {
	const { resizable, userCustomSettings, closeableRowActions } = useContext( TableContext );
	const activeTable = useTableStore( ( state ) => state.activeTable );
	const sorting = useTableStore( ( state ) => state.tables[ activeTable ]?.sorting || [] );
	const isTooltip = cell.column.columnDef.tooltip && cell.getValue();
	const style = typeof cell?.column.columnDef?.style === 'function' ? cell?.column.columnDef?.style( cell ) : cell?.column.columnDef?.style || {};

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

function TableRow( { row } ) {
	const returnedRow = useMemo( () => {
		const visibleCells = row.getVisibleCells();
		return <tr>
			{ visibleCells.map( ( cell, index ) => {
				const isEditCell = index === visibleCells.length - 1 && cell.column.id === 'editRow';
				const isCheckbox = index === 0 && cell.column.id === 'check';

				if ( isCheckbox ) {
					return <TableCellCheckbox cell={ cell } key={ index } rowId={ row.id } />;
				}

				return <TableCell cell={ cell } key={ index } isEditCell={ isEditCell } />;
			} ) }
		</tr>;
	}, [ row ] );

	return returnedRow;
}

function useIsSelected( rowId ) {
	const { slug } = useContext( TableContext );
	const selectedRows = useSelectRows( ( state ) => state.selectedRows[ slug ] );

	if ( selectedRows && selectedRows[ rowId ] ) {
		return true;
	}

	return false;
}

export default TableRow;
