import { memo, useCallback, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import {
	flexRender,
} from '@tanstack/react-table';
import { update } from 'idb-keyval';

import Tooltip from '@mui/joy/Tooltip';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import useTableStore from '../hooks/useTableStore';

import { ReactComponent as SettingsIcon } from '../assets/images/menu-icon-settings.svg';

const getHeaderCellRealWidth = ( cell ) => {
	let sortButtonWidth = cell.querySelector( 'button' )?.offsetWidth;
	let labelSpanWidth = cell.querySelector( 'span.column-label' )?.offsetWidth;

	sortButtonWidth = sortButtonWidth ? sortButtonWidth : 0;
	labelSpanWidth = labelSpanWidth ? labelSpanWidth : 0;
	return sortButtonWidth + labelSpanWidth;
};

const TableHead = ( { customSlug, tableContainerRef, resizable, closeableRowActions } ) => {
	let slug = useTableStore( ( state ) => state.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}

	const columnVisibility = useTableStore( ( state ) => state.tables[ slug ]?.columnVisibility );
	const openedRowActions = true;

	const toggleOpenedRowActions = useCallback( () => {
		if ( closeableRowActions ) {
			update( slug, ( dbData ) => {
				return { ...dbData, openedRowActions: ! openedRowActions };
			} );

			useTableStore.setState( () => (
				{
					tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], openedRowActions: ! useTableStore.getState().tables[ slug ]?.openedRowActions } },
				}
			) );
		}
	}, [ closeableRowActions, slug, openedRowActions ] );

	const table = useTableStore( ( state ) => state.tables[ slug ]?.table );

	// set width of columns according to header items width
	// default width of cells defined in each table is considered as source width which is used if cell header items (sort button and label) doesnt overflow defined width
	useEffect( () => {
		// data cells
		const nodes = tableContainerRef.current?.querySelectorAll( 'table.urlslab-table thead th:not(.editRow)' );
		const headerCells = nodes ? Object.values( nodes ) : [];
		// edit cell
		const editCell = tableContainerRef.current?.querySelector( 'table.urlslab-table thead th.editRow' );

		for ( const c in headerCells ) {
			const cell = headerCells[ c ];
			const totalWidth = getHeaderCellRealWidth( cell ) + 16; // count with paddings
			const defaultWidth = cell.dataset.defaultwidth ? parseInt( cell.dataset.defaultwidth ) : totalWidth;
			const finalWidth = totalWidth > defaultWidth ? totalWidth : defaultWidth;

			if ( closeableRowActions ) {
				cell.style.width = `${ finalWidth }px`;
				// first cell
				if ( parseInt( c ) === 0 ) {
					cell.style.width = `calc(${ finalWidth }px + var(--TableCellFirst-paddingLeft) )`;
				}

				// last data cell
				if ( parseInt( c ) === headerCells.length - 1 ) {
					if ( editCell ) {
						// make width of last data cell bigger of floating toggle button width to make its text always visible
						cell.style.width = `calc( ${ finalWidth }px + 2 * var(--TableCell-paddingX) + var(--Table-editRowClosedColumnWidth, 0) )`;
					} else {
						// edit cell not present, add just right table padding as it's last cell
						cell.style.width = `calc( ${ finalWidth }px + 2 * var(--TableCell-paddingX) + var(--TableCellLast-paddingRight) )`;
					}
				}
			} else {
				cell.style.width = `${ finalWidth }px`;
				// first cell
				if ( parseInt( c ) === 0 ) {
					cell.style.width = `calc(${ finalWidth }px + var(--TableCellFirst-paddingLeft) )`;
				}
				// last cell
				if ( parseInt( c ) === headerCells.length - 1 ) {
					cell.style.width = `calc(${ finalWidth }px + var(--TableCellLast-paddingRight) )`;
				}
			}
		}
	}, [ closeableRowActions, tableContainerRef, columnVisibility ] );

	return (
		<thead className="urlslab-table-head">
			{ table?.getHeaderGroups().map( ( headerGroup ) => (
				<tr className="urlslab-table-head-row" key={ headerGroup.id }>
					{ headerGroup.headers.map( ( header, index ) => {
						const isEditCell = index === headerGroup.headers.length - 1 && header.id === 'editRow';
						return (
							<th
								key={ header.id }
								className={ classNames( [
									header.column.columnDef.className,
									closeableRowActions && isEditCell && ! openedRowActions ? 'closed' : null,
								] ) }
								data-defaultwidth={ header.getSize() }
								style={ {
									...( resizable ? { position: 'absolute', left: header.getStart() } : null ),
									...( ! isEditCell && header.getSize() !== 0 ? { width: header.getSize() } : null ),
								} }
							>

								{ header.isPlaceholder
									? null
									: flexRender(
										typeof header.column.columnDef.header === 'string'
											? <span className="column-label">{ header.column.columnDef.header }</span>
											: header.column.columnDef.header,
										header.getContext()
									)
								}

								{ ( resizable && header.column.columnDef.enableResizing !== false )
									? <div
										{ ...{
											onMouseDown: header.getResizeHandler(),
											onTouchStart: header.getResizeHandler(),
											className: `resizer ${ header.column.getIsResizing() ? 'isResizing' : '' }`,
										} }
									/>
									: null
								}

								{ closeableRowActions && isEditCell && (
									<Stack className="action-buttons-wrapper" direction="row" justifyContent="end" sx={ { width: '100%' } }>
										<Tooltip title={ openedRowActions ? __( 'Hide rows actions' ) : __( 'Show rows actions' ) }>
											<IconButton className="editRow-toggle-button" variant="soft" size="xs" onClick={ toggleOpenedRowActions }>
												<SettingsIcon />
											</IconButton>
										</Tooltip>
									</Stack>
								) }
							</th>
						);
					} )
					}
				</tr>
			) ) }
		</thead>
	);
};

export default memo( TableHead );
