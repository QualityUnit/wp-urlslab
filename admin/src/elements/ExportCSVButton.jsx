
import { useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { jsonToCSV } from 'react-papaparse';
// eslint-disable-next-line import/no-extraneous-dependencies
import fileDownload from 'js-file-download';

import Button from '@mui/joy/Button';

import { fetchDataForProcessing } from '../api/fetchDataForProcessing';
import useTableStore from '../hooks/useTableStore';

import SvgIcon from './SvgIcon';

export default function ExportCSVButton( { options, className, onClick } ) {
	const { __ } = useI18n();
	const exportDisabled = useRef();

	const { slug } = options;
	const filters = useTableStore( ( state ) => state.tables[ slug ]?.filters || {} );

	function handleExportFiltered() {
		onClick( 1 );
		exportDisabled.current = true;
		fetchDataForProcessing( { ...options, filters }, ( status ) => onClick( status ) ).then( ( response ) => {
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
		fetchDataForProcessing( options, ( status ) => onClick( status ) ).then( ( response ) => {
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
