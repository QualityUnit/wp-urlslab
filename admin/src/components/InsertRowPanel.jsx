import { useQueryClient } from '@tanstack/react-query';

import { setData } from '../api/fetching';
import useChangeRow from '../hooks/useChangeRow';
import Button from '../elements/Button';

export default function InsertRowPanel( { columns, inserter } ) {
	const queryClient = useQueryClient();

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

	const { __ } = useI18n();
	const [ importStatus, setImportStatus ] = useState();
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );
	const importCounter = 0;

	const hidePanel = ( operation ) => {
		handleClose();
		if ( handlePanel ) {
			handlePanel( operation );
		}
	};

	// const importData = useMutation({
	// 	mutationFn: async (results) => {
	// 		await importCsv(`${slug}/import`, results.data, handleImportStatus);
	// 	},
	// });
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
					{ importStatus
						? <ProgressBar className="mb-m" notification="Importing…" value={ importStatus } />
						: null
					}
					<CSVReader
						onUploadAccepted={ ( results ) => {
							importData.mutate( results );
						} }
						config={ {
							header: true,
						} }
					>
						{ ( {
							getRootProps,
							acceptedFile,
							getRemoveFileProps,
						} ) => (
							<div className="flex">
								<div className="ma-left flex flex-align-center">
									{ acceptedFile &&
										<button className="removeFile flex flex-align-center" { ...getRemoveFileProps() }>{ acceptedFile.name } <CloseIcon /></button>
									}
									<Button className="ml-s simple" onClick={ () => hidePanel() }>{ __( 'Cancel' ) }</Button>

									<Button { ...getRootProps() } active>
										<ImportIcon />
										{ __( 'Import CSV' ) }
									</Button>
								</div>
							</div>

						) }
					</CSVReader>
				</div>
			</div>
		</div>
	);

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
