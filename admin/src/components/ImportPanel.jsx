import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { useCSVReader } from 'react-papaparse';
import importCsv from '../api/importCsv';

import useCloseModal from '../hooks/useCloseModal';

import { ReactComponent as ImportIcon } from '../assets/images/icon-import.svg';
import Button from '../elements/Button';
import ProgressBar from '../elements/ProgressBar';

export default function ImportPanel( { slug, handlePanel } ) {
	const { __ } = useI18n();
	const [ importStatus, setImportStatus ] = useState();
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );
	let importCounter = 0;

	const hidePanel = ( operation ) => {
		handleClose();
		if ( handlePanel ) {
			handlePanel( operation );
		}
	};

	const queryClient = useQueryClient();
	const { CSVReader } = useCSVReader();

	const handleImportStatus = ( val ) => {
		setImportStatus( val );

		if ( importCounter === 0 ) {
			queryClient.invalidateQueries( [ slug ] );
		}

		if ( val === 100 ) {
			queryClient.invalidateQueries( [ slug ] );
			setTimeout( () => {
				setImportStatus();
				hidePanel();
			}, 1000 );
		}
		importCounter += 1;
	};

	const importData = useMutation( {
		mutationFn: async ( results ) => {
			await importCsv( `${ slug }/import`, results.data, handleImportStatus );
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
}
