import { useContext } from 'react';
import classNames from 'classnames';
import { flexRender } from '@tanstack/react-table';

import useTableStore from '../hooks/useTableStore';
import useSelectRows from '../hooks/useSelectRows';
import useUserLocalData from '../hooks/useUserLocalData';

import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';

import { TableContext } from './TableComponent';

const TableCellCheckbox = ( { cell, rowId } ) => {
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
				disablePortal
			>
				<div className="limit">
					{ flexRender( cell.column.columnDef.cell, cell.getContext() ) }
				</div>
			</Tooltip>
		</td>
	);
};

function TableCell( { cell, isEditCell } ) {
	const { slug, resizable, closeableRowActions } = useContext( TableContext );
	const sorting = useTableStore().useSorting();
	const isTooltip = cell.column.columnDef.tooltip && cell.getValue();
	const style = typeof cell?.column.columnDef?.style === 'function' ? cell?.column.columnDef?.style( cell ) : cell?.column.columnDef?.style || {};

	const openedRowActions = useUserLocalData( ( state ) => state.userData[ slug ]?.openedRowActions === undefined ? true : state.userData[ slug ].openedRowActions );

	return (
		cell.column.getIsVisible() &&
		<td
			key={ cell.id }
			className={ classNames( [
				cell.column.columnDef.className,
				sorting.length && sorting[ 0 ].key === cell.column.columnDef.accessorKey ? 'highlight' : null,
				closeableRowActions && isEditCell && ! openedRowActions ? 'closed' : null,
			] ) }
			colSpan={ isEditCell ? 2 : null }
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
				leaveDelay={ 100 }
				disablePortal
			>
				<div className="limit">
					{ flexRender( cell.column.columnDef.cell, cell.getContext() ) }
				</div>
			</Tooltip>
		</td>
	);
}

function TableRow( { row } ) {
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
