import { useMemo, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { useCSVReader } from 'react-papaparse';
import importCsv from '../api/importCsv';

import useCloseModal from '../hooks/useCloseModal';

import { ReactComponent as ImportIcon } from '../assets/images/icon-import.svg';
import Button from '../elements/Button';
import ProgressBar from '../elements/ProgressBar';

export default function ImportPanel( { slug, header, handlePanel } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const { CSVReader } = useCSVReader();
	const [ importStatus, setImportStatus ] = useState();
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );
	let importCounter = 0;

	// Function to generate required/optional headers for CSV import
	const csvFields = useMemo( () => {
		const optionalHeaders = { ...header };
		// Getting slug endpoints from prefetched routes
		const routeEndpoints = queryClient.getQueryData( [ 'routes' ] )?.routes[ `/urlslab/v1/${ slug }` ]?.endpoints;
		// Getting slug arguments
		const endpointArgs = routeEndpoints?.filter( ( endpoint ) => endpoint?.methods[ 0 ] === 'POST' )[ 0 ]?.args;

		const requiredFields = [];

		// Getting list of required fields for slug
		Object.entries( endpointArgs ).filter( ( [ key, valObj ] ) => {
			if ( typeof valObj === 'object' && valObj?.required === true ) {
				requiredFields.push( key );
				delete optionalHeaders[ key ]; // Removing required
			}
			return false;
		} );

		// Removing fields that are probably generated
		// Fields that have length or usage in name are generated, regex to remove them
		const removeFieldsRegex = /^.*(length|usage).*$/g;

		Object.keys( optionalHeaders ).map( ( key ) => {
			if ( removeFieldsRegex.test( key ) ) {
				delete optionalHeaders[ key ];
			}
			return false;
		} );
		return { requiredFields, optionalFields: Object.keys( optionalHeaders ) };
	}, [ queryClient, slug, header ] );

	const hidePanel = ( operation ) => {
		handleClose();
		if ( handlePanel ) {
			handlePanel( operation );
		}
	};

	const handleImportStatus = ( val ) => {
		setImportStatus( val );

		if ( importCounter === 0 ) {
			queryClient.invalidateQueries( [ slug ] );
		}

		if ( val === 100 ) {
			importCounter = 0;
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
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
				</div>

				<div className="mt-l">
					<div className="urlslab-panel-section">
						<p>{ __( 'CSV file should contain headers:' ) }</p>

						{ csvFields?.requiredFields?.length > 0 &&
							<div className="flex">
								<div>
									<p><strong>{ __( 'Required headers:' ) }</strong></p>
									<ul>
										{ csvFields?.requiredFields.map( ( field ) => {
											return (
												<li key={ field }>{ `${ header[ field ] } (${ field })` }</li>
											);
										} ) }
									</ul>
								</div>
								<div className="ml-xxl">
									<p><strong>{ __( 'Optional headers:' ) }</strong></p>
									<ul>
										{ csvFields?.optionalFields?.map( ( field ) => {
											return (
												<li key={ field }>{ `${ header[ field ] } (${ field })` }</li>
											);
										} ) }
									</ul>
								</div>
							</div>
						}
					</div>
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
									<Button className="ml-s simple" onClick={ hidePanel }>{ __( 'Cancel' ) }</Button>

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
