import {
	flexRender,
	getCoreRowModel,
	useReactTable } from '@tanstack/react-table';

export default function Table( props ) {
	const { className, columns, data } = props;

	const table = useReactTable( {
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	} );

	return (
		<table className={ `urlslab-table urlslab-table-${ className }` }>
			<thead className={ `urlslab-table-head ${ className }` }>
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
			<tbody className={ `urlslab-table-body ${ className }` } >
				{ table.getRowModel().rows.map( ( row ) => (
					<tr key={ row.id }>
						{ row.getVisibleCells().map( ( cell ) => (
							<td key={ cell.id }>
								{ flexRender( cell.column.columnDef.cell, cell.getContext() ) }
							</td>
						) ) }
					</tr>
				) ) }
			</tbody>
		</table>
	);
}
