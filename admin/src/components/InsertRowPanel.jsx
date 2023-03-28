import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';

import { setData } from '../api/fetching';
import useChangeRow from '../hooks/useChangeRow';
import useCloseModal from '../hooks/useCloseModal';
import Button from '../elements/Button';

export default function InsertRowPanel( { columns, inserter, handlePanel } ) {
	const queryClient = useQueryClient();
	const { __ } = useI18n();
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );

	const hidePanel = ( operation ) => {
		handleClose();
		if ( handlePanel ) {
			handlePanel( operation );
		}
	};

	const { inserterCells, data, slug, url, rowToInsert } = inserter;
	const tableCells = columns.filter( ( obj ) => obj.accessorKey !== 'check' && obj.accessorKey !== 'delete' );

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
		<div className="urlslab-panel-wrap urlslab-panel-floating fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ __( 'Import data' ) }</h3>
					<button className="urlslab-panel-close" onClick={ () => hidePanel() }>
						<CloseIcon />
					</button>
				</div>
				<div className="mt-l">
					{
						tableCells.map( ( cell ) => {
							const cellId = cell.accessorKey;

							return <div key={ cellId }>
								{ inserterCells[ cellId ] }
							</div>;
						} )
					}
					<Button active onClick={ () => insertRow( { data, url, slug, rowToInsert, pseudoRow } ) }>Add row</Button>
				</div>
			</div>
		</div>
	);
}
