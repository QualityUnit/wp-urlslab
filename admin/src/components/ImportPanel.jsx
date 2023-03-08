import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { useCSVReader } from 'react-papaparse';
import importCsv from '../api/importCsv';

import useCloseModal from '../hooks/useCloseModal';

import { ReactComponent as ImportIcon } from '../assets/images/icon-import.svg';
import Button from '../elements/Button';

export default function ImportPanel( { slug, handlePanel } ) {
	const { __ } = useI18n();
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );

	const hidePanel = ( operation ) => {
		handleClose();
		if ( handlePanel ) {
			handlePanel( operation );
		}
	};

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
		<div className="urlslab-panel-wrap urlslab-panel-floating fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ __( 'Import data' ) }</h3>
					<button className="urlslab-panel-close" onClick={ () => hidePanel() }>
						<CloseIcon />
					</button>
				</div>

				<div className="flex">
					<Button className="ma-left simple" onClick={ () => hidePanel() }>{ __( 'Cancel' ) }</Button>
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
							<div className="ml-s flex flex-align-center">
								{ acceptedFile &&
								<button className="removeFile flex flex-align-center" { ...getRemoveFileProps() }>{ acceptedFile.name } <CloseIcon /></button>
								}
								<Button { ...getRootProps() } active>
									<ImportIcon />
									{ __( 'Import CSV' ) }
								</Button>
							</div>

						) }
					</CSVReader>
				</div>
			</div>
		</div>
	);
}
