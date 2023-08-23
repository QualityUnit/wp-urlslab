
import { useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { jsonToCSV } from 'react-papaparse';
// eslint-disable-next-line import/no-extraneous-dependencies
import fileDownload from 'js-file-download';
import { fetchDataForProcessing } from '../api/fetchDataForProcessing';

import { ReactComponent as ExportIcon } from '../assets/images/icons/icon-export.svg';
import Button from './Button';

export default function ExportCSVButton( { options, className, withfilters, onClick } ) {
	const { __ } = useI18n();
	const exportDisabled = useRef();

	function handleExport() {
		onClick( 1 );
		exportDisabled.current = true;
		if ( withfilters ) {
			fetchDataForProcessing( options, ( status ) => onClick( status ) ).then( ( response ) => {
				if ( onClick && response.status === 'done' ) {
					const csv = jsonToCSV( response, {
						delimiter: ',',
						header: true }
					);

					fileDownload( csv, `${ options.altSlug ? options.altSlug : options.slug }.csv` );
					exportDisabled.current = false;
				}
			} );
		}
		if ( ! withfilters ) {
			delete options.filters;
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
	}

	return (
		<Button ref={ exportDisabled } className={ className } active disabled={ exportDisabled.current }
			onClick={ handleExport }>
			<ExportIcon />
			{ withfilters
				? __( 'Export Filtered' )
				: __( 'Export All' )
			}
		</Button>
	);
}
