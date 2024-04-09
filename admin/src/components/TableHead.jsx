import { memo, useCallback, useContext, useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { flexRender } from '@tanstack/react-table';

import useUserLocalData from '../hooks/useUserLocalData';
import SvgIcon from '../elements/SvgIcon';

import Stack from '@mui/joy/Stack';
import Tooltip from '@mui/joy/Tooltip';

import { TableContext } from './TableComponent';

const getHeaderCellRealWidth = ( cell ) => {
	let sortButtonWidth = cell.querySelector( 'button' )?.offsetWidth;
	let labelSpanWidth = cell.querySelector( 'span.column-label' )?.offsetWidth;

	sortButtonWidth = sortButtonWidth ? sortButtonWidth : 0;
	labelSpanWidth = labelSpanWidth ? labelSpanWidth : 0;
	return sortButtonWidth + labelSpanWidth;
};

const TableHead = () => {
	const { slug, tableContainerRef, table, resizable, closeableRowActions } = useContext( TableContext );
	const editThRef = useRef();
	const didMountRef = useRef( false );

	const setUserLocalData = useUserLocalData( ( state ) => state.setUserLocalData );
	const openedRowActions = useUserLocalData( ( state ) => state.userData[ slug ]?.openedRowActions === undefined ? true : state.userData[ slug ].openedRowActions );
	const columnVisibility = useUserLocalData( ( state ) => state.userData[ slug ]?.columnVisibility );

	const toggleOpenedRowActions = useCallback( () => {
		if ( closeableRowActions ) {
			setUserLocalData( slug, { openedRowActions: ! openedRowActions } );
		}
	}, [ closeableRowActions, openedRowActions, setUserLocalData, slug ] );

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
		if ( didMountRef.current ) {
			tableContainerRef.current?.style.setProperty( '--Table-editHeadColumnWidth', `${ editThRef?.current?.clientWidth }px` );
		}
	}, [ closeableRowActions, tableContainerRef, columnVisibility ] );

	useEffect( () => {
		if ( didMountRef.current ) {
			tableContainerRef.current?.style.setProperty( '--Table-editHeadColumnWidth', `${ editThRef?.current?.clientWidth }px` );

			const resizeWatcher = new ResizeObserver( ( [ entry ] ) => {
				if ( entry.borderBoxSize && tableContainerRef.current ) {
					tableContainerRef.current?.style.setProperty( '--Table-editHeadColumnWidth', `${ editThRef?.current?.clientWidth }px` );
				}
			} );
			if ( editThRef?.current ) {
				resizeWatcher.observe( document.querySelector( 'table.urlslab-table thead th.editRow' ) );
			}
		}
		didMountRef.current = true;
	} );

	return (
		<thead className="urlslab-table-head">
			{ table.getHeaderGroups().map( ( headerGroup ) => (
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
								colSpan={ isEditCell ? 2 : null }
								ref={ isEditCell ? editThRef : null }
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
							</th>
						);
					} )
					}
					{ closeableRowActions &&
						<th className={ `editRow-toggle pos-sticky ${ ! openedRowActions ? 'closed' : null }` }>
							<Stack className="editRow-toggle-inn"
								direction="column"
								justifyContent="center"
								alignItems="flex-end"
							>
								<Tooltip title={ openedRowActions ? __( 'Hide rows actions', 'urlslab' ) : __( 'Show rows actions', 'urlslab' ) }>
									<button className="editRow-toggle-button" onClick={ toggleOpenedRowActions }>
										<SvgIcon name="chevron" />
									</button>
								</Tooltip>
							</Stack>
						</th>
					}
				</tr>
			) ) }
		</thead>
	);
};

export default memo( TableHead );
