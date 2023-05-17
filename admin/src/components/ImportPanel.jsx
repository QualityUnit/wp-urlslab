import { useMemo, useRef, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { useCSVReader } from 'react-papaparse';
import importCsv from '../api/importCsv';

import useCloseModal from '../hooks/useCloseModal';
import { useFilter } from '../hooks/filteringSorting';

import { ReactComponent as ImportIcon } from '../assets/images/icons/icon-import.svg';
import Button from '../elements/Button';
import ProgressBar from '../elements/ProgressBar';

export default function ImportPanel( { props, handlePanel } ) {
	const { slug, header, initialRow } = props;
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const { CSVReader } = useCSVReader();
	const [ importStatus, setImportStatus ] = useState();
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );
	const { handleType } = useFilter( { slug, header, initialRow } );
	let importCounter = 0;
	const stopImport = useRef( false );

	// Function to generate required/optional headers for CSV import
	const csvFields = useMemo( () => {
		// Getting slug endpoints from prefetched routes
		const routeEndpoints = queryClient.getQueryData( [ 'routes' ] )?.routes[ `/urlslab/v1/${ slug }/create` ]?.endpoints;
		// Getting slug arguments
		const endpointArgs = routeEndpoints?.filter( ( endpoint ) => endpoint?.methods[ 0 ] === 'POST' )[ 0 ]?.args;

		const requiredFields = [];
		const optionalFields = [];

		// Removing fields that are probably generated
		// Fields that have length or usage in name are generated, regex to remove them
		const removeFieldsRegex = /^.*(length|usage|wpml_language).*$/g;

		const setType = ( key ) => {
			let type = handleType( key, ( cellOptions ) => cellOptions );
			if ( type === 'lang' ) {
				type = 'like "en", "fr", "es" etc.';
			}
			if ( type === 'date' ) {
				type = 'ie "2023–04–31 09:00:00" (YYYY-MM-dd HH:mm:ss)';
			}
			if ( type === 'boolean' ) {
				type = 'true/false';
			}
			return type;
		};

		// Getting list of required fields for slug
		if ( endpointArgs ) {
			Object.entries( endpointArgs ).filter( ( [ key, valObj ] ) => {
				if ( typeof valObj === 'object' && valObj?.required === true ) {
					requiredFields.push( { key, type: setType( key ) } );
				}
				if ( typeof valObj === 'object' && valObj?.required !== true && ! removeFieldsRegex.test( key ) ) {
					optionalFields.push( { key, type: setType( key ) } );
				}
				return false;
			} );
		}

		return { requiredFields, optionalFields };
	}, [ queryClient, slug, header ] );

	const hidePanel = ( operation ) => {
		stopImport.current = true;

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
			await importCsv( { slug: `${ slug }/import`, dataArray: results.data, result: handleImportStatus, stopImport } );
		},
	} );
	return (
		<div className="urlslab-panel-wrap urlslab-panel-modal fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ __( 'Import data' ) }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
				</div>

				<div className="mt-l">
					{
						( csvFields?.requiredFields.length > 0 || csvFields?.optionalFields.length > 0 ) &&
						<div className="urlslab-panel-section">
							<p>{ __( 'CSV file should contain headers:' ) }</p>

							<div className="flex">
								{ csvFields?.requiredFields?.length > 0 &&
								<div>
									<p><strong>{ __( 'Required headers:' ) }</strong></p>
									<ul>
										{ csvFields?.requiredFields.map( ( field ) => {
											return (
												<li key={ field.key }>
													{ `${ header[ field.key ] } (${ field.key })` }
													{ typeof field.type !== 'object' // Check if object = menu
														? ` – ${ field.type }`
														: <ul className="pl-s">
															{ Object.entries( field.type ).map( ( [ key, val ] ) => {
																return <li key={ key }>{ `${ key } – ${ val }` }</li>;
															} ) }
														</ul>
													}
												</li>
											);
										} ) }
									</ul>
								</div>
								}
								{ csvFields?.optionalFields.length > 0 &&
								<div className="ml-xxl">
									<p><strong>{ __( 'Optional headers:' ) }</strong></p>
									<ul>
										{ csvFields?.optionalFields?.map( ( field ) => {
											return (
												<li key={ field.key }>
													{ `${ header[ field.key ] } (${ field.key })` }
													{ typeof field.type !== 'object' // Check if object = menu
														? ` – ${ field.type }`
														: <ul className="pl-s">
															{ Object.entries( field.type ).map( ( [ key, val ] ) => {
																return <li key={ key }>{ `${ key } – ${ val }` }</li>;
															} ) }
														</ul>
													}
												</li>
											);
										} ) }
									</ul>
								</div>
								}
							</div>
						</div>
					}
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
									<Button className="mr-s" onClick={ hidePanel }>{ __( 'Cancel' ) }</Button>

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
