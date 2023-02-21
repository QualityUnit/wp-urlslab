import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useCSVReader } from 'react-papaparse';
import importCsv from '../api/importCsv';
import { deleteAll } from '../api/deleteTableData';

import { ReactComponent as ImportIcon } from '../assets/images/icon-import.svg';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';
import Button from '../elements/Button';
import ExportCSVButton from '../elements/ExportCSVButton';

export default function TableViewHeaderBottom( { children, slug, exportOptions } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const { CSVReader } = useCSVReader();

	const importData = useMutation( {
		mutationFn: async ( results ) => {
			return importCsv( `${ slug }/import`, results.data );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ slug ] );
		},
	} );

	const handleDelete = useMutation( {
		mutationFn: () => {
			return deleteAll( slug );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ slug ] );
		},
	} );

	return (
		<div className="urlslab-tableView-headerBottom flex">
			<Button onClick={ () => handleDelete.mutate() }>{ __( 'Delete All' ) }</Button>

			<ExportCSVButton className="ml-s-tablet" options={ exportOptions } onClick={ ( data ) => console.log( data ) } />

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
					<>
						<div className="">
							<Button className="ml-s-tablet" { ...getRootProps() }>
								<ImportIcon />
								{ __( 'Import CSV' ) }
							</Button>
						</div>
						<div className="flex">
							{ acceptedFile &&
								<>{ acceptedFile.name } <CloseIcon /></>
							}
						</div>
					</>
				) }
			</CSVReader>
			{
				children
			}
			{
				queryClient.isMutating() ? <h2>Importing</h2> : null
			}
		</div>
	);
}
