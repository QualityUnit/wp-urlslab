import { jsonToCSV } from 'react-papaparse';
// eslint-disable-next-line import/no-extraneous-dependencies
import fileDownload from 'js-file-download';
import { jsonData, exportCSV } from '../api/exportCsv';
import { useI18n } from '@wordpress/react-i18n';

import { ReactComponent as ExportIcon } from '../assets/images/icon-export.svg';
import Button from './Button';

export default function ExportCSVButton( { className, options, onClick } ) {
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
				onClick( jsonData );
				fileDownload( csv, `${ options.url }.csv` );
			}
		} );
	};
	return (
		<Button className={ className }
			onClick={ handleExport }>
			<ExportIcon />
			{ __( 'Export CSV' ) }
		</Button>
	);
}
