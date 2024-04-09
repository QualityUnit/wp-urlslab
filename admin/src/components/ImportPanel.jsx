import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { useCSVReader } from 'react-papaparse';
import importCsv from '../api/importCsv';
import { langCodes } from '../api/fetchLangs';

import Button from '@mui/joy/Button';

import useCloseModal from '../hooks/useCloseModal';
import { useFilter } from '../hooks/useFilteringSorting';
import useTableStore from '../hooks/useTableStore';

import ProgressBar from '../elements/ProgressBar';
import SvgIcon from '../elements/SvgIcon';

function ImportPanel() {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const { CSVReader } = useCSVReader();
	const [ importStatus, setImportStatus ] = useState();
	const [ checkedResults, setCheckedResults ] = useState();
	const importDisabled = useRef();
	const { CloseIcon, handleClose } = useCloseModal();

	const slug = useTableStore( ( state ) => state.activeTable );
	const header = useTableStore( ( state ) => state.tables[ slug ]?.header );
	const { handleType } = useFilter();

	const checkLangs = useCallback( ( results ) => {
		if ( results?.data?.length && ( results?.data[ 0 ].lang || results?.data[ 0 ].language ) ) {
			const { data } = results;
			let badRows = {};

			for ( const [ rowIndex, row ] of data.entries() ) {
				const lang = row.lang || row.language;
				const validLang = langCodes.indexOf( lang ) !== -1;

				if ( ! validLang ) {
					const rows = Object.keys( badRows ).length && badRows[ lang ] ? [ ...badRows[ lang ], rowIndex ] : [];
					badRows = { ...badRows, [ lang ]: rows };
				}

				if ( rowIndex === data.length - 1 ) {
					setCheckedResults( { results, badRows } );
					return badRows;
				}
			}
		}
		return [];
	}, [ ] );

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

	const hidePanel = ( invalidateQuery ) => {
		stopImport.current = true;
		handleClose();
		if ( invalidateQuery === 'invalidate' ) {
			queryClient.invalidateQueries( [ slug ] );
		}
	};

	const handleImportStatus = ( val ) => {
		setImportStatus( val );

		if ( importCounter === 0 ) {
			queryClient.invalidateQueries( [ slug ] );
		}

		if ( val === 100 ) {
			importCounter = 0;
			setTimeout( () => {
				setImportStatus();
				importDisabled.current = false;
				hidePanel( 'invalidate' );
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
					<h3>{ __( 'Import data', 'urlslab' ) }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
				</div>

				<div className="mt-l">
					{
						( csvFields?.requiredFields.length > 0 || csvFields?.optionalFields.length > 0 ) &&
							! checkedResults
							? <div className="urlslab-panel-section">
								<p>{ __( 'CSV file should contain headers:', 'urlslab' ) }</p>

								<div className="flex">
									{ csvFields?.requiredFields?.length > 0 &&
									<div>
										<p><strong>{ __( 'Required headers:', 'urlslab' ) }</strong></p>
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
										<p><strong>{ __( 'Optional headers:', 'urlslab' ) }</strong></p>
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
							: <div className="urlslab-panel-section">
								<h3 className="c-darker-saturated-red">{ __( 'CSV table probably contains invalid language codes:', 'urlslab' ) }</h3>
								<ul>
									{ Object.keys( checkedResults?.badRows ).map( ( lang ) => {
										return <li key={ lang }>
											<strong>{ lang }</strong>
										</li>;
									} ) }
								</ul>
							</div>
					}
					{ importStatus > 0
						? <ProgressBar className="mb-m" notification="Importing…" value={ importStatus } />
						: null
					}
					<CSVReader
						onUploadAccepted={ ( results ) => {
							setImportStatus( 1 );
							if ( ! checkLangs( results )?.length ) {
								importDisabled.current = true;
								importData.mutate( results );
							}
						} }
						config={ {
							header: true,
							download: false,
						} }
					>
						{ ( {
							getRootProps,
							acceptedFile,
							getRemoveFileProps,
						} ) => {
							return <div className="flex">
								<div className="ma-left flex flex-align-center">
									{ acceptedFile &&
									<button className="removeFile flex flex-align-center" { ...getRemoveFileProps() }>{ acceptedFile.name } <CloseIcon /></button>
									}
									<Button variant="plain" color="neutral" onClick={ hidePanel } sx={ { mr: 1 } }>{ __( 'Cancel', 'urlslab' ) }</Button>

									{ ! checkedResults
										? <Button
											ref={ importDisabled }
											{ ...getRootProps() }
											disabled={ importDisabled.current === true }
											startDecorator={ <SvgIcon name="import" /> }
										>
											{ __( 'Import CSV', 'urlslab' ) }
										</Button>
										: <Button
											disabled={ importDisabled.current === true }
											color="danger"
											startDecorator={ <SvgIcon name="import" /> }
											onClick={ () => {
												setImportStatus( 1 );
												importDisabled.current = true;
												importData.mutate( checkedResults?.results );
											} }
										>
											{ __( 'Import anyway', 'urlslab' ) }
										</Button>
									}
								</div>
							</div>;
						}

						}
					</CSVReader>
				</div>
			</div>
		</div>
	);
}

export default memo( ImportPanel );
