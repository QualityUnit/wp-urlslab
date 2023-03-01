
import { useQueryClient } from '@tanstack/react-query';
import { jsonToCSV } from 'react-papaparse';
// eslint-disable-next-line import/no-extraneous-dependencies
import fileDownload from 'js-file-download';
import { exportCSV } from '../api/exportCsv';
import { useI18n } from '@wordpress/react-i18n';

import { ReactComponent as ExportIcon } from '../assets/images/icon-export.svg';
import Button from './Button';

export default function ExportCSVButton( { className, options, onClick } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();

	function sendNotification( val ) {
		queryClient.setQueryData( [ 'notifications' ], ( data ) => {
			return { ...data, export: val };
		} );
		queryClient.invalidateQueries( [ 'notifications' ] );
	}

	function handleExport() {
		if ( onClick ) {
			queryClient.setQueryData( [ 'notifications' ], ( data ) => {
				return { ...data, export: '0' };
			} );
			queryClient.invalidateQueries( [ 'notifications' ] );
		}
		exportCSV( options, ( val ) => sendNotification( val ) ).then( ( response ) => {
			if ( onClick && response.status === 'done' ) {
				const csv = jsonToCSV( response, {
					delimiter: ',',
					header: true }
				);

				fileDownload( csv, `${ options.url }.csv` );
			}
		} );
	}

	return (
		<Button className={ className }
			onClick={ handleExport }>
			<ExportIcon />
			{ __( 'Export CSV' ) }
		</Button>
	);
}
