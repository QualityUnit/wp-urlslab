/* eslint-disable indent */
import { useRef, useCallback, useState, useEffect } from 'react';
import { get } from 'idb-keyval';
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { useVirtual } from 'react-virtual';

import useTableStore from '../hooks/useTableStore';

import { useI18n } from '@wordpress/react-i18n';
import AddNewTableRecord from '../elements/AddNewTableRecord';

import JoyTable from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';

import '../assets/styles/components/_TableComponent.scss';
import classNames from 'classnames';

export default function Table( { resizable, children, className, columns, data, initialState, returnTable } ) {
	const { __ } = useI18n();
	const [ columnVisibility, setColumnVisibility ] = useState( initialState?.columnVisibility || {} );
	const tableContainerRef = useRef();
	const tableRef = useRef();
	const title = useTableStore( ( state ) => state.title );
	const slug = useTableStore( ( state ) => state.slug );
	const [ rowSelection, setRowSelection ] = useState( {} );
	const setTable = useTableStore( ( state ) => state.setTable );
	const filters = useTableStore( ( state ) => state.filters );
	const sorting = useTableStore( ( state ) => state.sorting );
	const hasFilters = Object.keys( filters ).length ? true : false;
	const checkTableOverflow = useCallback( () => {
		if ( tableContainerRef.current?.clientHeight < tableRef.current?.clientHeight ) {
			return 'has-scrollbar';
		}

		return '';
	}, [] );

	const getColumnState = useCallback( () => {
		get( slug ).then( async ( dbData ) => {
			if ( dbData?.columnVisibility && Object.keys( dbData?.columnVisibility ).length ) {
				await setColumnVisibility( dbData?.columnVisibility );
			}
		} );
	}, [ slug ] );

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
			columnVisibility,
		},
		columnResizeMode: 'onChange',
		enableRowSelection: true,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
	}, );

	useEffect( () => {
		const nodes = tableRef.current?.querySelectorAll( 'thead th' );
		const headerCells = nodes ? Object.values( nodes ) : [];
		for ( const c in headerCells ) {
			const cell = headerCells[ c ];
			let sortButtonWidth = cell.querySelector( 'button' )?.offsetWidth;
			let labelSpanWidth = cell.querySelector( 'span.column-label' )?.offsetWidth;

			sortButtonWidth = sortButtonWidth ? sortButtonWidth : 0;
			labelSpanWidth = labelSpanWidth ? labelSpanWidth : 0;
			const totalWidth = sortButtonWidth + labelSpanWidth + 45;
			if ( totalWidth > cell.offsetWidth ) {
				cell.style.width = `${ totalWidth }px`;
			}
		}
	}, [ columnVisibility ] );

	useEffect( () => {
		getColumnState();
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
			const tableContainerWidth = document.documentElement.clientWidth - adminMenuWidth - 54;
			tableContainerRef.current?.style.setProperty( '--tableContainerWidth', `${ tableContainerWidth }px` );
		};

		tableContainerRef.current?.style.setProperty( '--tableContainerScroll', '0px' );

		const adminMenuWidth = document.querySelector( '#adminmenuwrap' ).clientWidth;
		const resizeWatcher = new ResizeObserver( ( [ entry ] ) => {
			if ( entry.borderBoxSize && tableContainerRef.current ) {
				getTableContainerWidth();
			}
		} );

		tableContainerRef.current?.addEventListener( 'scroll', () => {
			tableContainerRef.current?.style.setProperty( '--tableContainerScroll', `${ tableContainerRef.current?.scrollLeft }px` );
		} );

		resizeWatcher.observe( document.documentElement );
	}, [ table, rowSelection, setTable, checkTableOverflow, getColumnState ] );

	if ( table && returnTable ) {
		returnTable( table );
	}

	const tbody = [];

	const { rows } = table?.getRowModel();

	const rowVirtualizer = useVirtual( {
		parentRef: tableContainerRef,
		size: rows?.length,
		overscan: 10,
	} );

	const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
	const paddingTop = virtualRows?.length > 0 ? virtualRows?.[ 0 ]?.start || 0 : 0;
	const paddingBottom =
		virtualRows?.length > 0
			? totalSize - ( virtualRows?.[ virtualRows.length - 1 ]?.end || 0 )
			: 0;

	for ( const virtualRow of virtualRows ) {
		const row = rows[ virtualRow?.index ];
		tbody.push(
			<tr key={ row.id } className={ row.getIsSelected() ? 'selected' : '' }>
				{ row.getVisibleCells().map( ( cell ) => {
					return (
						cell.column.getIsVisible() &&
						<td
							key={ cell.id }
							className={ classNames( [
								sorting.length && sorting[ 0 ].key === cell.column.columnDef.accessorKey ? 'highlight' : null,
								cell.column.columnDef.className,
								] ) }
							style={ {
								width: cell.column.getSize() !== 0 && resizable
									? cell.column.getSize()
									: undefined,
							} }
						>
							{ /** its safe to use always Tooltip, nullish values doesn't render tooltip */ }
							<Tooltip
								placement="bottom-start"
								title={
									cell.column.columnDef.tooltip
									? <Box sx={ { maxWidth: '45rem' } }>{ flexRender( cell.column.columnDef.tooltip, cell.getContext() ) }</Box>
									: null
								}
							>
								<Box className="cell-wrapper" sx={ { height: '100%', display: 'flex', alignItems: 'center' } }>
									<div className="limit">
										{ flexRender( cell.column.columnDef.cell, cell.getContext() ) }
									</div>
								</Box>
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
		/*<div className={ `urlslab-table-container ${ checkTableOverflow() }` } ref={ tableContainerRef } >*/
		<Sheet
			ref={ tableContainerRef }
			variant="plain"
			className={ `urlslab-table-container ${ checkTableOverflow() }` }
			mainTableContainer
		>
			<JoyTable
					ref={ tableRef }
					className={ `${ className } ${ resizable ? 'resizable' : '' }` }
					//sx={ { width: table.getCenterTotalSize() } }
					stripe="odd"
					mainTable
				>
				{ /* <table  className={ `urlslab-table ${ className } ${ resizable ? 'resizable' : '' }` }
					style={ {width: table.getCenterTotalSize(), } }> */ }
				<thead className="urlslab-table-head">
					{ table.getHeaderGroups().map( ( headerGroup ) => (
						<tr className="urlslab-table-head-row" key={ headerGroup.id }>
							{ headerGroup.headers.map( ( header, index ) => (
								<th
										key={ header.id }
										className={ header.column.columnDef.className }
										style={ {
											//position: resizable ? 'absolute' : 'relative',
											//left: resizable ? header.getStart() : '0',
											width: header.getSize() !== 0 ? header.getSize() : '',
											...( index === headerGroup.headers.length - 1 ? { width: 'var(--Table-lastColumnWidth)' } : null ),
										} }
								>
									{ header.isPlaceholder
										? null
										: flexRender(
											typeof header.column.columnDef.header === 'string'
											? <span className="column-label">{ header.column.columnDef.header }</span>
											: header.column.columnDef.header,
											header.getContext()
										) }
									{ ( resizable && header.column.columnDef.enableResizing !== false )
										? <div
											{ ...{
												onMouseDown: header.getResizeHandler(),
												onTouchStart: header.getResizeHandler(),
												className: `resizer ${ header.column.getIsResizing() ? 'isResizing' : ''
													}`,
											} }
										/>
										: null
									}
								</th>
							) ) }
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
