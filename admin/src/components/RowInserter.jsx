import useChangeRow from '../hooks/useChangeRow';
import Button from '../elements/Button';

export default function RowInserter( { columns, inserter } ) {
	const { inserterCells, data, slug, url, rowToInsert } = inserter;
	const tableCells = columns.filter( ( obj ) => obj.accessorKey !== 'check' && obj.accessorKey !== 'delete' );
	const hasCheck = columns.filter( ( obj ) => obj.accessorKey === 'check' ? true : false );
	const hasDelete = columns.filter( ( obj ) => obj.accessorKey === 'delete' ? true : false );

	let pseudoRow = {};

	Object.keys( data?.pages[ 0 ] ).map( ( key ) => {
		if ( key.search( /(id|md5)/g ) !== -1 ) {
			return pseudoRow[ key ] = Math.ceil( Math.random() * 100000 ) + '';
		}
		return pseudoRow[ key ] = '';
	} );

	pseudoRow = { ...pseudoRow, ...rowToInsert };

	const { insertRow } = useChangeRow();

	return (
		<tr className="urlslab-rowInserter">
			{
				tableCells.map( ( cell, index ) => {
					const cellId = cell.accessorKey;
					if ( index === 0 ) {
						return <th key={ cellId } colSpan={ hasCheck ? '2' : '' }>
							<div>+</div>
							{ inserterCells[ cellId ] }
						</th>;
					}
					if ( index + 1 === tableCells.length ) {
						return <th key={ cellId } colSpan={ hasDelete ? '2' : '' }>
							<div className="flex flex-align-center">
								{ inserterCells[ cellId ] }
								<Button active onClick={ () => insertRow( { data, url, slug, rowToInsert, pseudoRow } ) }>Add row</Button>
							</div>
						</th>;
					}
					return <th key={ cellId }>
						{ inserterCells[ cellId ] }
					</th>;
				} )
			}
		</tr>
	);
}
