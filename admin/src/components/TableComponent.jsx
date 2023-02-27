import { useRef, useState } from 'react';
import {
	flexRender,
	getCoreRowModel,
	useReactTable } from '@tanstack/react-table';

import { useVirtual } from 'react-virtual';

import '../assets/styles/components/_TableComponent.scss';

export default function Table( { resizable, children, className, columns, data } ) {
	const [ rowSelection, setRowSelection ] = useState( {} );

	const tableContainerRef = useRef();
	const table = useReactTable( {
		columns,
		data,
		defaultColumn: {
			minSize: resizable ? 80 : 24,
			size: resizable ? 100 : 24,
		},
		state: {
			rowSelection,
		},
		columnResizeMode: 'onChange',
		enableRowSelection: true,
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

	const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
	const paddingTop = virtualRows?.length > 0 ? virtualRows?.[ 0 ]?.start || 0 : 0;
	const paddingBottom =
		virtualRows?.length > 0
			? totalSize - ( virtualRows?.[ virtualRows.length - 1 ]?.end || 0 )
			: 0;

	for ( const virtualRow of virtualRows ) {
		const row = rows[ virtualRow?.index ];
		tbody.push(
			<tr key={ row.id } className={ row.getIsSelected() ? 'selected' : '' } style={ {
				position: 'relative',
			} } >
				{ row.getVisibleCells().map( ( cell ) =>
					<td key={ cell.id } className={ cell.column.columnDef.className }
						style={ {
							position: resizable ? 'absolute' : 'static',
							left: resizable ? cell.column.getStart() : '0',
							width: cell.column.getSize() !== 0 && resizable
								? cell.column.getSize()
								: undefined,
						} }
					>
						{ flexRender( cell.column.columnDef.cell, cell.getContext() ) }
					</td>
				) }
			</tr>
		);
	}

	return (
		<div className="urlslab-table-container" ref={ tableContainerRef }>
			<table className={ `urlslab-table ${ className } ${ resizable ? 'resizable' : '' }` } style={ {
				width: table.getCenterTotalSize(),
			} }>
				<thead className="urlslab-table-head">
					{ table.getHeaderGroups().map( ( headerGroup ) => (
						<tr key={ headerGroup.id }>
							{ headerGroup.headers.map( ( header ) => (
								<th key={ header.id }
									style={ {
										position: resizable ? 'absolute' : 'relative',
										left: resizable ? header.getStart() : '0',
										width: header.getSize() !== 0 && resizable ? header.getSize() : undefined,
									} }
								>
									{ header.isPlaceholder
										? null
										: flexRender(
											header.column.columnDef.header,
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
			</table>
			{ children }
		</div>
	);
}
