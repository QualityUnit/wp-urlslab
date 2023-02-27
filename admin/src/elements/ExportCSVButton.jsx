
import { useQueryClient } from '@tanstack/react-query';
import { jsonToCSV } from 'react-papaparse';
// eslint-disable-next-line import/no-extraneous-dependencies
import fileDownload from 'js-file-download';
import { exportCSV } from '../api/exportCsv';
import { useI18n } from '@wordpress/react-i18n';
// import Worker from '../constants/exportWorker.js?worker';

import { ReactComponent as ExportIcon } from '../assets/images/icon-export.svg';
import Button from './Button';

export default function ExportCSVButton( { className, options, onClick } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();

	function handleExport() {
		// const worker = new Worker( '' );
		// worker.postMessage( {
		// 	url: 'keyword',
		// 	fromId: 'from_kw_id',
		// 	pageId: 'kw_id',
		// 	deleteCSVCols: [ 'kw_id', 'destUrlMd5' ],
		// } );
		// 	// console.log( 'message' );
		// worker.onmessage = ( message ) => {
		// 	console.log( message );
		// };
		if ( onClick ) {
			queryClient.setQueryData( [ 'notifications' ], ( data ) => {
				return { ...data, export: 'running' };
			} );
			queryClient.invalidateQueries( [ 'notifications' ] );
		}
		exportCSV( options ).then( ( response ) => {
			if ( onClick && response.status === 'done' ) {
				const csv = jsonToCSV( response, {
					delimiter: ',',
					header: true }
				);
				queryClient.setQueryData( [ 'notifications' ], ( data ) => {
					return { ...data, export: 'done' };
				} );
				queryClient.invalidateQueries( [ 'notifications' ] );
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
