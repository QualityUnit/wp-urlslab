import {
	flexRender,
	getCoreRowModel,
	useReactTable } from '@tanstack/react-table';

import '../assets/styles/components/_TableComponent.scss';

export default function Table( props ) {
	const { className, columns, data } = props;

	const table = useReactTable( {
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	} );

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
				{ table.getRowModel().rows.map( ( row ) => (
					<tr key={ row.id }>
						{ row.getVisibleCells().map( ( cell ) =>
							( <td key={ cell.id } className={ cell.column.columnDef.className }>
								{ flexRender( cell.column.columnDef.cell, cell.getContext() ) }
								{ console.log( cell.getContext() ) }
							</td> )
						) }
					</tr>
				) ) }
			</tbody>
		</table>
	);
}
