
// import { useQueryClient } from '@tanstack/react-query';
import { jsonToCSV } from 'react-papaparse';
// eslint-disable-next-line import/no-extraneous-dependencies
import fileDownload from 'js-file-download';
import { exportCSV } from '../api/exportCsv';
import { useI18n } from '@wordpress/react-i18n';

import { ReactComponent as ExportIcon } from '../assets/images/icons/icon-export.svg';
import Button from './Button';

export default function ExportCSVButton( { options, className, withfilters, onClick } ) {
	const { __ } = useI18n();

	function handleExport() {
		onClick( 1 );
		if ( withfilters ) {
			exportCSV( options, ( status ) => onClick( status ) ).then( ( response ) => {
				if ( onClick && response.status === 'done' ) {
					const csv = jsonToCSV( response, {
						delimiter: ',',
						header: true }
					);

					fileDownload( csv, `${ options.altSlug ? options.altSlug : options.slug }.csv` );
				}
			} );
		}
		if ( ! withfilters ) {
			delete options.url.filters;
			exportCSV( options, ( status ) => onClick( status ) ).then( ( response ) => {
				if ( onClick && response.status === 'done' ) {
					const csv = jsonToCSV( response, {
						delimiter: ',',
						header: true,
					}
					);

					fileDownload( csv, `${ options.altSlug ? options.altSlug : options.slug }.csv` );
				}
			} );
		}
	}

	return (
		<Button className={ className } active
			onClick={ handleExport }>
			<ExportIcon />
			{ withfilters
				? __( 'Export Filtered' )
				: __( 'Export All' )
			}
		</Button>
	);
}
