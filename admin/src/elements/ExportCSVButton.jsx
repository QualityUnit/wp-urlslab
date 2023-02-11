import { jsonToCSV } from 'react-papaparse';
import fileDownload from 'js-file-download';
import { jsonData, exportCSV } from '../api/import-export-csv';
import { useI18n } from '@wordpress/react-i18n';
import Button from './Button';

export default function ExportCSVButton( { options, onClick } ) {
	const { __ } = useI18n();

	const handleExport = () => {
		if ( onClick ) {
			onClick( jsonData );
		}
		exportCSV( options ).then( ( response ) => {
			if ( onClick && response.status === 'done' ) {
				const csv = jsonToCSV( response, {
					delimiter: ',',
					header: true }
				);
				fileDownload( csv, 'keywords_links.csv' );
			}
		} );
	};
	return (
		<Button className="active"
			onClick={ handleExport }>
			{ __( 'Export CSV' ) }
		</Button>
	);
}
