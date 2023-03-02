import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { useCSVReader } from 'react-papaparse';
import importCsv from '../api/importCsv';

import { ReactComponent as ImportIcon } from '../assets/images/icon-import.svg';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';
import BackButton from '../elements/BackButton';
import Button from '../elements/Button';

export default function ImportPanel( { slug, backToTable } ) {
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
	return (
		<div className="urlslab-panel-importexport">
			<BackButton className="mb-l" onClick={ () => backToTable() }>{ __( 'Back to table' ) }</BackButton>

			<div className="urlslab-panel">
				<h4 className="mb-l">{ __( 'Import data' ) }</h4>

				<div className="flex">
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
									<Button className="ma-left" { ...getRootProps() } active>
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
				</div>
			</div>
		</div>

	);
}
