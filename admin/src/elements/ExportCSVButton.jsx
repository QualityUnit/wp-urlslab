
import { useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { jsonToCSV } from 'react-papaparse';
// eslint-disable-next-line import/no-extraneous-dependencies
import fileDownload from 'js-file-download';

import Button from '@mui/joy/Button';

import { fetchDataForProcessing } from '../api/fetchDataForProcessing';

import SvgIcon from './SvgIcon';

export default function ExportCSVButton( { options, disabled, className, onClick } ) {
	const { __ } = useI18n();
	const exportDisabled = useRef( disabled );

	const { filters = {} } = options;

	const handleResponse = ( response ) => {
		onClick( response.progress );
		if ( onClick && response.status === 'done' ) {
			const csv = jsonToCSV( response.data, {
				delimiter: ',',
				header: true,
			}
			);

			fileDownload( csv, `${ options.altSlug ? options.altSlug : options.slug }.csv` );
			if ( response.progress === 100 ) {
				exportDisabled.current = false;
			}
		}
	};

	function handleExportFiltered() {
		onClick( 1 );
		exportDisabled.current = true;
		fetchDataForProcessing( { ...options, filters }, ( response ) => onClick( response.progress ) ).then( ( response ) => {
			if ( onClick && response.status === 'done' ) {
				const csv = jsonToCSV( response, {
					delimiter: ',',
					header: true,
				}
				);

				fileDownload( csv, `${ options.altSlug ? options.altSlug : options.slug }.csv` );
				exportDisabled.current = false;
			}
		} );
	}
	function handleExport() {
		onClick( 1 );
		exportDisabled.current = true;
		fetchDataForProcessing( options, ( response ) => handleResponse( response ) );
	}

	return (
		<>
			{ Object.keys( filters ).length > 0 &&
			<Button
				ref={ exportDisabled }
				className={ className }
				disabled={ exportDisabled.current === true }
				onClick={ handleExportFiltered }
				sx={ { ml: 1 } }
				startDecorator={ <SvgIcon name="export" /> }
			>
				{ __( 'Export Filtered' ) }
			</Button>
			}
			<Button
				ref={ exportDisabled }
				className={ className }
				disabled={ exportDisabled.current === true }
				onClick={ handleExport }
				sx={ { ml: 1 } }
				startDecorator={ <SvgIcon name="export" /> }
			>
				{ __( 'Export All' ) }
			</Button>
		</>
	);
}
