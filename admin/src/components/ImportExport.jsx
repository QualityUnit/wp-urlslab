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
	// const importLocal = ( parsedData ) => {
	// 	// console.log( queryClient.getQueryData( [ 'tableKeyword' ] ) );
	// 	// console.log( parsedData );
	// 	setCSVMessage( __( 'Processing data…' ) );
	// 	queryClient.setQueryData( [ 'tableKeyword' ], parsedData );
	// 	setCSVMessage( null );
	// };

	const importData = useMutation( {
		mutationFn: ( results ) => {
			queryClient.setQueryData( [ importOptions.url ], results.data );
			return importCsv( `${ importOptions.url }/import`, results.data ).then( ( res ) => console.log( res ) );
		},
		onSettled: () => {
			queryClient.invalidateQueries( [ importOptions.url ] );
		},
	} );

	return (
		<div className="urlslab-importexport-wrap flex fadeInto">
			<div className="urlslab-importexport">
				<div className="urlslab-importexport-import urlslab-panel">

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
				</div>
				<div className="urlslab-importexport-export urlslab-panel">

					<ExportCSVButton options={ exportOptions } onClick={ ( data ) => console.log( data ) } />
				</div>
			</div>
		</div>
	);
}
