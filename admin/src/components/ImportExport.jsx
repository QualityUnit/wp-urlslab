import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useCSVReader } from 'react-papaparse';
import importCsv from '../api/importCsv';

import Button from '../elements/Button';
import ExportCSVButton from '../elements/ExportCSVButton';
import '../assets/styles/components/_ImportExport.scss';

export default function ImportExport( { children, importOptions, exportOptions } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const { CSVReader } = useCSVReader();

	const importData = useMutation( {
		mutationFn: ( results ) => {
			return importCsv( `${ importOptions.url }/import`, results.data );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ importOptions.url ] );
		},
	} );

	return (
		<div className="urlslab-importexport-wrap flex">
			{ /* <ImportCSVButton options={ importOptions } onClick={ ( data ) => console.log( data ) } /> */ }
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
						<div>
							<Button className="active" { ...getRootProps() }>
								{ __( 'Import CSV' ) }
							</Button>
							<div>
								{ acceptedFile && acceptedFile.name }
							</div>
						</div>
					</>
				) }
			</CSVReader>

			<ExportCSVButton options={ exportOptions } onClick={ ( data ) => console.log( data ) } />
			{
				queryClient.isMutating() && <h2>Importing</h2>
			}
		</div>
	);
}
