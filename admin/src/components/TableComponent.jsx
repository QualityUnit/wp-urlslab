import {
	flexRender,
	getCoreRowModel,
	useReactTable } from '@tanstack/react-table';
// import { useState } from 'react';

import '../assets/styles/components/_TableComponent.scss';

export default function Table( { className, columns, data } ) {
	const table = useReactTable( {
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	} );

	const tbody = [];
	const cells = [];

	const pushToCells = ( row ) => {
		for ( const cell of row.getVisibleCells() ) {
			( <td key={ cell.id } className={ cell.column.columnDef.className }>
				{ flexRender( cell.column.columnDef.cell, cell.getContext() ) }
				{ /* { console.log( cell.getContext() ) } */ }
			</td> );
		}
	};

	for ( const row of table.getRowModel().rows ) {
		tbody.push(
			<tr key={ row.id }>
				{
					pushToCells( row )
				}
				{
					cells
				}
			</tr>
		);
	}

	return (
		<table className={ `urlslab-table urlslab-table-${ className }` }>
			<thead className="urlslab-table-head">
				{ table.getHeaderGroups().map( ( headerGroup ) => (
					<tr key={ headerGroup.id }>
						{ headerGroup.headers.map( ( header ) => (
							<th key={ header.id }>
								{ header.isPlaceholder
									? null
									: flexRender(
										header.column.columnDef.header,
										header.getContext()
									) }
							</th>
						) ) }
					</tr>
				) ) }
			</thead>
			<tbody className="urlslab-table-body" >
				{ tbody }
			</tbody>
		</table>
	);
}
