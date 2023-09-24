import { useRef, useCallback, useState, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import classNames from 'classnames';
import { get, update } from 'idb-keyval';
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { useVirtual } from 'react-virtual';

import useTableStore from '../hooks/useTableStore';

import AddNewTableRecord from '../elements/AddNewTableRecord';

import JoyTable from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';

import { ReactComponent as SettingsIcon } from '../assets/images/menu-icon-settings.svg';

import '../assets/styles/components/_TableComponent.scss';

const getHeaderCellRealWidth = ( cell ) => {
	let sortButtonWidth = cell.querySelector( 'button' )?.offsetWidth;
	let labelSpanWidth = cell.querySelector( 'span.column-label' )?.offsetWidth;

	sortButtonWidth = sortButtonWidth ? sortButtonWidth : 0;
	labelSpanWidth = labelSpanWidth ? labelSpanWidth : 0;
	return sortButtonWidth + labelSpanWidth;
};

export default function Table( { resizable, children, className, columns, data, initialState, returnTable, closeableRowActions = false } ) {
	const { __ } = useI18n();
	const [ userCustomSettings, setUserCustomSettings ] = useState( {
		columnVisibility: initialState?.columnVisibility || {},
		openedRowActions: false,
	} );
	const tableContainerRef = useRef();
	const columnsInitialized = useRef( false );
	const rowActionsInitialized = useRef( false );
	const title = useTableStore( ( state ) => state.title );
	const slug = useTableStore( ( state ) => state.slug );
	const [ rowSelection, setRowSelection ] = useState( {} );
	const setTable = useTableStore( ( state ) => state.setTable );
	const filters = useTableStore( ( state ) => state.filters );
	const sorting = useTableStore( ( state ) => state.sorting );
	const hasFilters = Object.keys( filters ).length ? true : false;

	const setColumnVisibility = useCallback( ( updater ) => {
		// updater can be update function, or object with defined values in case "hide all / show all" action
		setUserCustomSettings( ( s ) => ( { ...s, columnVisibility: typeof updater === 'function' ? updater( s.columnVisibility ) : updater } ) );
	}, [] );

	const checkTableOverflow = useCallback( () => {
		if ( tableContainerRef.current?.clientHeight < tableContainerRef.current?.querySelector( 'table.urlslab-table' )?.clientHeight ) {
			tableContainerRef.current?.style.setProperty( '--Table-ScrollbarWidth', '16px' );
			return 'has-scrollbar';
		}

		tableContainerRef.current?.style.setProperty( '--Table-ScrollbarWidth', '0px' );
		return '';
	}, [] );

	const toggleOpenedRowActions = useCallback( () => {
		if ( closeableRowActions ) {
			update( slug, ( dbData ) => {
				return { ...dbData, openedRowActions: ! userCustomSettings.openedRowActions };
			} );
			setUserCustomSettings( ( s ) => ( { ...s, openedRowActions: ! s.openedRowActions } ) );
		}
	}, [ closeableRowActions, slug, userCustomSettings.openedRowActions ] );

	// fetch user defined settings from internal db
	const getUserCustomSettings = useCallback( () => {
		get( slug ).then( ( dbData ) => {
			if ( dbData?.columnVisibility && Object.keys( dbData?.columnVisibility ).length ) {
				setUserCustomSettings( ( s ) => ( { ...s, columnVisibility: dbData?.columnVisibility } ) );
			}

			if ( closeableRowActions ) {
				if ( dbData?.openedRowActions !== undefined ) {
					setUserCustomSettings( ( s ) => ( { ...s, openedRowActions: dbData.openedRowActions } ) );
				} else {
					// on first load open edit settings
					setUserCustomSettings( ( s ) => ( { ...s, openedRowActions: true } ) );
				}
			}

			// wait a while until user defined settings are loaded from internal db
			// prevents jumping of columns
			columnsInitialized.current = true;
		} );
	}, [ slug ] );

	// save css variable for closed toggle button width
	if ( closeableRowActions && tableContainerRef.current && ! rowActionsInitialized.current ) {
		const toggleButton = tableContainerRef.current.querySelector( 'thead th.editRow .editRow-toggle-button' );
		if ( toggleButton ) {
			tableContainerRef.current.style.setProperty( '--Table-editRowClosedColumnWidth', `${ toggleButton.offsetWidth + 3 }px` );
			rowActionsInitialized.current = true;
		}
	}

	const table = useReactTable( {
		columns,
		data,
		defaultColumn: {
			minSize: resizable ? 80 : 32,
			size: resizable ? 100 : 32,
		},
		initialState,
		state: {
			rowSelection,
			columnVisibility: userCustomSettings.columnVisibility,
		},
		columnResizeMode: 'onChange',
		enableRowSelection: true,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
	}, );

	const tbody = [];

	const { rows } = table?.getRowModel();

	const rowVirtualizer = useVirtual( {
		parentRef: tableContainerRef,
		size: rows?.length,
		overscan: 10,
	} );

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
	}, [ closeableRowActions, userCustomSettings.columnVisibility ] );

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
	}, [ closeableRowActions, userCustomSettings.openedRowActions, rowVirtualizer.virtualItems ] );

	useEffect( () => {
		if ( closeableRowActions && ! userCustomSettings.openedRowActions ) {
			tableContainerRef.current?.style.setProperty( '--Table-editRowColumnWidth', '0px' );
		}
	}, [ closeableRowActions, userCustomSettings.openedRowActions ] );

	useEffect( () => {
		getUserCustomSettings();
		setTable( table );

		useTableStore.setState( () => ( {
			selectedRows: rowSelection,
		} ) );

		if ( data?.length ) {
			useTableStore.setState( () => ( {
				initialRow: table?.getRowModel().rows[ 0 ],
			} ) );
		}

		const getTableContainerWidth = () => {
			const tableContainerWidth = document.documentElement.clientWidth - adminMenuWidth;
			tableContainerRef.current?.style.setProperty( '--tableContainerWidth', `${ tableContainerWidth }px` );
		};

		const adminMenuWidth = document.querySelector( '#adminmenuwrap' ).clientWidth;
		const resizeWatcher = new ResizeObserver( ( [ entry ] ) => {
			if ( entry.borderBoxSize && tableContainerRef.current ) {
				getTableContainerWidth();
			}
		} );
		resizeWatcher.observe( document.documentElement );
	}, [ table, rowSelection, setTable, checkTableOverflow, getUserCustomSettings ] );

	if ( table && returnTable ) {
		returnTable( table );
	}

	const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
	const paddingTop = virtualRows?.length > 0 ? virtualRows?.[ 0 ]?.start || 0 : 0;
	const paddingBottom =
		virtualRows?.length > 0
			? totalSize - ( virtualRows?.[ virtualRows.length - 1 ]?.end || 0 )
			: 0;

	for ( const virtualRow of virtualRows ) {
		const row = rows[ virtualRow?.index ];
		const visibleCells = row.getVisibleCells();
		tbody.push(
			<tr key={ row.id } className={ row.getIsSelected() ? 'selected' : '' }>
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
			</tr>
		);
	}

	if ( ! data?.length ) {
		return <div className="urlslab-table-fake">
			<div className="urlslab-table-fake-inn">
				{ title && ! hasFilters && <AddNewTableRecord title={ title } /> }
				{ hasFilters && <div className="bg-white p-m c-saturated-red">{ __( 'No items are matching your search or filter conditions.' ) }</div> }
			</div>
		</div>;
	}

	return (
		<Sheet
			ref={ tableContainerRef }
			variant="plain"
			className={ `urlslab-table-container ${ checkTableOverflow() }` }
			// hide table until user defined visible columns are loaded
			sx={ { opacity: columnsInitialized.current ? 1 : 0 } }
			urlslabTableContainer
		>
			<JoyTable
				className={ classNames( [
					'urlslab-table',
					className,
					resizable ? 'resizable' : null,
				] ) }
				urlslabTable
			>
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
											closeableRowActions && isEditCell && ! userCustomSettings.openedRowActions ? 'closed' : null,
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
												<Tooltip title={ userCustomSettings.openedRowActions ? __( 'Hide rows actions' ) : __( 'Show rows actions' ) }>
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
			</JoyTable>
			{ children }
		</Sheet>
	);
}
